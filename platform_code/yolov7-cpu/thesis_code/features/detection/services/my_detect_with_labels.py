import argparse
import time
from pathlib import Path

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path, apply_my_classifier
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel, load_my_classifier
from utils.mode_config import get_model_config
from thesis_code.features.detection.config import ALLOWED_CLASSIFICATION_CATEGORIES

def detect_with_labels(opt_source, 
           opt_rectangles = [],
           opt_weights='./runs/train/yolov7-carpet/weights/best.pt', 
           opt_img_size=640, 
           opt_conf_thres=0.25, 
           opt_iou_thres=0.45, 
           opt_device='', 
           opt_view_img=False, 
           opt_save_txt=False, 
           opt_save_conf=False, 
           opt_nosave=False, 
           opt_classes=None, 
           opt_agnostic_nms=False, 
           opt_augment=False, 
           opt_update=False, 
           opt_project='runs/detect', 
           opt_name='exp', 
           opt_exist_ok=False, 
           opt_no_trace=True, 
           opt_apply_custom_classifier=True):
    
    apply_custom_classifier, source, weights, view_img, save_txt, imgsz, trace = opt_apply_custom_classifier, opt_source, opt_weights, opt_view_img, opt_save_txt, opt_img_size, not opt_no_trace
    
    save_img = not opt_nosave and not source.endswith('.txt')  # save inference images
    webcam = source.isnumeric() or source.endswith('.txt') or source.lower().startswith(
        ('rtsp://', 'rtmp://', 'http://', 'https://'))

    # Directories
    save_dir = Path(opt_project)  #Path(increment_path(Path(opt_project) / opt_name, exist_ok=opt_exist_ok))  # increment run
    (save_dir / 'labels' if save_txt else save_dir).mkdir(parents=True, exist_ok=True)  # make dir

    # Initialize
    set_logging()
    device = select_device(opt_device)
    half = device.type != 'cpu'  # half precision only supported on CUDA

    if(device.type != 'cpu'):
        compute_capability = torch.cuda.get_device_capability(device=device)    
        half = (device.type != 'cpu') and (compute_capability[0] >= 8)  # half precision only supported on CUDA

    # Load model
    model = attempt_load(weights, map_location=device)  # load FP32 model
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(imgsz, s=stride)  # check img_size

    if trace:
        model = TracedModel(model, device, opt_img_size)

    if half:
        model.half()  # to FP16

    # Second-stage classifier
    classify = False
    if classify:
        modelc = load_classifier(name='resnet101', n=2)  # initialize
        modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model']).to(device).eval()

    # Set Dataloader
    vid_path, vid_writer = None, None
    if webcam:
        view_img = check_imshow()
        cudnn.benchmark = True  # set True to speed up constant image size inference
        dataset = LoadStreams(source, img_size=imgsz, stride=stride)
    else:
        dataset = LoadImages(source, img_size=imgsz, stride=stride)
    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

    # Run inference
    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # run once
    old_img_w = old_img_h = imgsz
    old_img_b = 1

    t0 = time.time()
    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)
        # Warmup
        if device.type != 'cpu' and (old_img_b != img.shape[0] or old_img_h != img.shape[2] or old_img_w != img.shape[3]):
            old_img_b = img.shape[0]
            old_img_h = img.shape[2]
            old_img_w = img.shape[3]
            for i in range(3):
                model(img, augment=opt_augment)[0]

        # Inference
        t1 = time_synchronized()
        with torch.no_grad():   # Calculating gradients would cause a GPU memory leak
            pred = model(img, augment=opt_augment)[0]
        t2 = time_synchronized()
        # Apply NMS
        print("pred before NMS")
        pred = non_max_suppression(pred, opt_conf_thres, opt_iou_thres, classes=opt_classes, agnostic=opt_agnostic_nms)
        t3 = time_synchronized()

        # Apply Classifier
        if classify:
            pred = apply_classifier(pred, modelc, img, im0s)

          # Process detections
            
        #### Thesis code get bboxes and categories to detect the category regarding the label ####
        bboxes= opt_rectangles['bboxes']
        categories = opt_rectangles['categories']
        
        if  bboxes:
            rectangles_tensor = torch.tensor(bboxes)
        
        # Process detections
        for i, det in enumerate([rectangles_tensor]):  # detections per image
            category_counts = {category: {} for category in ALLOWED_CLASSIFICATION_CATEGORIES} # Initialize the dictionary using a dictionary comprehension
            
            print(f'Image number {i} with bboxes {det}')

            if webcam:  # batch_size >= 1
                p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(), dataset.count
            else:
                p, s, im0, frame = path, '', im0s, getattr(dataset, 'frame', 0)

            p = Path(p)  # to Path
            save_path = str(save_dir / p.name)  # img.jpg
            print(save_dir, p.name)
            if len(det):
                for  i, xyxy in enumerate(det):  
                    if apply_custom_classifier:
                        category = categories[i] # Determine the category
                        weights_path, output_nodes, labels = get_model_config(category)

                        modelc = load_my_classifier(name='resnet101', n=output_nodes)  # initialize
                        modelc.load_state_dict(torch.load(weights_path))
                        modelc.eval()

                        label_new = apply_my_classifier(modelc, xyxy, im0, labels)

                        # Check if the label is new for the category, if so initialize its count
                        if label_new not in category_counts[category]:
                            category_counts[category][label_new] = 0

                        # Increment the count of the label for the given category
                        category_counts[category][label_new] += 1

                        #label = f'{names[int(cls)]} {conf:.2f}'
                        plot_one_box(xyxy, im0, label=label_new, color=colors[int(0)], line_thickness=2)

            # Print time (inference + NMS)
            print(f'{s}Done. ({(1E3 * (t2 - t1)):.1f}ms) Inference, ({(1E3 * (t3 - t2)):.1f}ms) NMS')

            # Stream results
            if view_img:
                cv2.imshow(str(p), im0)
                cv2.waitKey(1)  # 1 millisecond

            # Save results (image with detections) 
            if save_img:
                if dataset.mode == 'image':
                    cv2.imwrite(save_path, im0)
                    print(f" The image with the result is saved in: {save_path}")
                else:  # 'video' or 'stream'
                    if vid_path != save_path:  # new video
                        vid_path = save_path
                        if isinstance(vid_writer, cv2.VideoWriter):
                            vid_writer.release()  # release previous video writer
                        if vid_cap:  # video
                            fps = vid_cap.get(cv2.CAP_PROP_FPS)
                            w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                            h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                        else:  # stream
                            fps, w, h = 30, im0.shape[1], im0.shape[0]
                            save_path += '.mp4'
                        vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))
                    vid_writer.write(im0)

    if save_txt or save_img:
        s = f"\n{len(list(save_dir.glob('labels/*.txt')))} labels saved to {save_dir / 'labels'}" if save_txt else ''
        #print(f"Results saved to {save_dir}{s}")

    print(f'Done. ({time.time() - t0:.3f}s)')

    return save_path, category_counts


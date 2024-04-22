# Assessing Indoor Spaces for People with Dementia

This repository contains all the necessary documents and code for my thesis project completed as part of my MSc in Computational Intelligence. The project focuses on assessing indoor spaces to enhance accessibility and safety for individuals with dementia.

## Repository Structure

This repository is organized into two main folders: `report`, `collabnotebooks` and `platform_code`.

### Report Folder

The `report` folder contains the following key documents of the thesis:

- `Thesis_Report.pdf` - This document is the full thesis report which details the research, methodology, results, and conclusions for the project titled "Assessing Indoor Spaces for People with Dementia."

- `Thesis_Presentation.pptx` - A presentation summarizing the thesis for dissemination to interested audiences.

### `collabnotebooks`

Jupyter notebooks for the machine learning models:

- `Classification_ResNet101_Training.ipynb`: Notebook for training the ResNet101 classification network.
- `Detection_YOLOv7_Training.ipynb`: Notebook for training the YOLOv7 detection network.

### Platform Code Folder

The `platform_code` folder contains the application components:

#### Client (React App)

- Handles user authentication and authorization.
- Enables photo uploads of indoor spaces for detection, storage, and viewing.
- Offers tools for users to annotate and label images, categorizing them into folders like House, Care Home, Building.
- Displays statistics on the images uploaded.

#### Auth (Node.js Server)

- Manages user authentication and session storage.
- Utilizes MongoDB to store user credentials and session data securely.

#### Images File Server (Node.js Server)

- Stores and manages the retrieval of uploaded images.
- Uses MongoDB to link images with metadata for efficient organization.
- Computes aggregated statistics based on the image metadata.

#### YOLOv7-cpu (Flask-Python Server)

- Performs object detection using YOLOv7.
- Utilizes ResNet101 for classification, assessing images for dementia-friendliness.

#### Common (Utility Library)

- Contains shared functionalities like error handling and middlewares.
- The `thesis-common` library is published on the NPM registry, inspired by [Stephen Grider's Udemy courses](https://www.udemy.com/user/sgslo/).

#### Docker Compose

- Orchestrates the construction of Docker containers for the client, auth, images file server, and YOLOv7-cpu services.

## Environment Variables

To run the servers, you must set up the environment variables `JWT_KEY` and `MONGO_URI`. Below is an example which you can add to a `.env.example` file:

```plaintext
# .env.example
JWT_KEY=your_jwt_secret
MONGO_URI=mongodb+srv://your_mongo_user:your_mongo_password@your_mongo_host/mydatabase?retryWrites=true&w=majority
```

## Setup and Installation

### Client, Auth, and Images File Server

For each of the `client`, `auth`, and `imagesFileServer` components:

1. Navigate to the respective folder:
   `cd path/to/folder `

2. Install NPM packages:
   `npm install`

3. Start the application:
   `npm start`

### YOLOv7-cpu

For the `yolov7-cpu` component:

1. Navigate to the `yolov7-cpu` folder:
   `cd path/to/yolov7-cpu`

2. Install the required Python packages:
   `pip install -r requirements.txt`

3. Run the application:
   `python -m app`


## Data Labeling and Dataset Structure

### YOLOv7
For training the YOLOv7 model, the images were labeled using [labelImg](https://github.com/HumanSignal/labelImg), a graphical image annotation tool. Annotations were made in the YOLO Darknet format. The dataset is structured as follows:
- `images/`
  - `test/`
  - `train/`
  - `val/`
- `labels/`
  - `test/`
  - `train/`
  - `val/`
Each `images` subfolder contains the image files, and each `labels` subfolder contains corresponding `.txt` files with annotations in Darknet format.

### ResNet Classification
For the ResNet101 classification model, the dataset structure consists of a folder containing subfolders named after each class (e.g., `bad_carpet`, `good_carpet`). Each subfolder contains image files corresponding to that class:
- `class_name_folder/` (e.g., `bad_carpet/`, `good_carpet/`)
  - `image1.jpg`
  - `image2.jpg`
  - ...


### Collaborative Notebooks

In the `collabnotebooks` folder, there are Jupyter notebooks used for training and testing the machine learning models:

### Classification Network Notebook

- `Classification_ResNet101_Training.ipynb`: This notebook contains the code for training and testing the classification network using ResNet101. It includes all necessary steps from data preprocessing to model evaluation.

   [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/triantafd/thesis-MsC/blob/main/collabnotebooks/Classification_ResNet101_Training.ipynb)

### Detection Network Notebook

- `Detection_YOLOv7_Training.ipynb`: This notebook details the process for training and testing the detection network utilizing YOLOv7. It encompasses the complete workflow from initializing the model to running detections.

  [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/triantafd/thesis-MsC/blob/main/collabnotebooks/Detection_YOLOv7_Training.ipynb)



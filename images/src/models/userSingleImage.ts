/** @format */

import mongoose from "mongoose";

interface SingleImageAttrs {
  userId: string;
  imgBuffer: Buffer;
  contentType: string;
}

interface SingleImageDoc extends mongoose.Document {
  userId: string;
  imgBuffer: Buffer;
  contentType: string;
}

interface SingleImageModel extends mongoose.Model<SingleImageDoc> {
  build(attrs: SingleImageAttrs): SingleImageDoc;
}

const singleImageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    imgBuffer: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

singleImageSchema.statics.build = (attrs: SingleImageAttrs) => {
  return new SingleImage(attrs);
};

const SingleImage = mongoose.model<SingleImageDoc, SingleImageModel>(
  "UserSingleImage",
  singleImageSchema
);

export { SingleImage };

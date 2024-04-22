import mongoose from "mongoose";

// Define the categories array with const assertion
const categories = ["carpet", "mirror"] as const;

// Extract the type from the array
type Category = (typeof categories)[number];

// Define the structure for metadata
type Metadata = {
  [K in Category]?: {
    [subcategory: string]: number;
  };
};

interface SingleImageAttrs {
  userId: string;
  imagePath: string;
  label: string; // New field for label
  metadata?: Metadata;
}

interface SingleImageDoc extends mongoose.Document {
  userId: string;
  imagePath: string;
  label: string; // New field for label
  metadata?: Metadata;
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
    imagePath: {
      // Changed from imgBuffer
      type: String,
      required: true,
    },
    label: {
      // Changed from imgBuffer
      type: String,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
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

import benchmark from "benny";
import { DynamicImage, OutputFormat } from "../src/dynamic-image";
import * as images from "../src/tests/images";

process.on("unhandledRejection", (reason) => {
  throw reason;
});

const loadImage = async () => {
  const image = new DynamicImage({
    bytes: await images.read(images.paths.catJpg),
  });

  return image;
};

const transformImage = (image: DynamicImage) => {
    image.resize({ width: 100, height: 100 });
    image.unsharpen({ sigma: 12, threshold: 2 });
};

const saveImage = (image: DynamicImage) => {
    image.toBytes({ format: OutputFormat.Png });
};
 
benchmark.suite(
  'DynamicImage',
 
  benchmark.add('Load image', async () => {
    await loadImage()
  }),
 
  benchmark.add('Transform image', async () => {
    const image = await loadImage();

    return () => {
        transformImage(image);
    };
  }),

  benchmark.add('Save and dispose image', async () => {
    const image = await loadImage();

    return () => {
        saveImage(image);
    };
  }),

  benchmark.cycle(),
  benchmark.complete(),
  benchmark.save({ file: 'DynamicImage' }),
)
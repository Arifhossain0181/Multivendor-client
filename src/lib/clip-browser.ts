import { pipeline } from "@xenova/transformers";

let clipPipeline: any = null;

const getClipPipeline = async () => {
  if (!clipPipeline) {
    clipPipeline = await pipeline("feature-extraction", "Xenova/clip-vit-base-patch32");
  }
  return clipPipeline;
};

export const generateImageEmbeddingFromFile = async (file: File): Promise<number[]> => {
  try {
    const classifier = await getClipPipeline();
    const output = await classifier(file, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data) as number[];
  } catch (error: any) {
    console.error("Failed to generate image embedding:", error.message);
    throw new Error(`Failed to generate image embedding: ${error.message}`);
  }
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Embedding dimensions do not match");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

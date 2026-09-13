import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

let modelPromise: Promise<poseDetection.PoseDetector> | null = null;

export async function preloadPoseModel() {
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    try {
      await tf.ready();
      await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true,
        },
      );

      return detector;
    } catch (error) {
      console.error("Failed to preload model:", error);
      throw error;
    }
  })();

  return modelPromise;
}

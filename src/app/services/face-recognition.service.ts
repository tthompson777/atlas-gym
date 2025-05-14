import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({ providedIn: 'root' })
export class FaceRecognitionService {
  async loadModels(): Promise<void> {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models/tiny_face_detector');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models/face_landmark_68');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models/face_recognition');
  }

  async detectFace(image: HTMLImageElement | HTMLVideoElement) {
    return await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
  }

  computeDistance(desc1: Float32Array, desc2: Float32Array): number {
    return faceapi.euclideanDistance(desc1, desc2);
  }
}


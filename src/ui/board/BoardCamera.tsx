import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function stopCamera(video: HTMLVideoElement) {
  stopTracks(video.srcObject as MediaStream | null);
  video.srcObject = null;
}

type CameraStatus = "opening" | "ready" | "capturing" | "unavailable";

export function BoardCamera({
  onCapture,
}: {
  onCapture: (image: Blob) => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRequest = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<CameraStatus>("opening");

  useEffect(() => () => cameraRequest.current?.abort(), []);

  function closeCamera() {
    cameraRequest.current?.abort();
    dialogRef.current?.close();
  }

  async function openCamera() {
    const video = videoRef.current!;
    const request = new AbortController();
    cameraRequest.current = request;
    setStatus("opening");
    dialogRef.current?.showModal();

    function unavailable() {
      if (request.signal.aborted) return;
      request.abort();
      setStatus("unavailable");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } },
      });
      if (request.signal.aborted) {
        stopTracks(stream);
        return;
      }
      video.srcObject = stream;
      request.signal.addEventListener("abort", () => stopCamera(video), {
        once: true,
      });
      stream.getVideoTracks()[0]?.addEventListener("ended", unavailable, {
        signal: request.signal,
      });
      await video.play();
      if (!request.signal.aborted) setStatus("ready");
    } catch {
      unavailable();
    }
  }

  function captureBoard() {
    const video = videoRef.current!;
    const request = cameraRequest.current!;
    const size = Math.min(video.videoWidth, video.videoHeight);
    if (status !== "ready" || !size) return;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) {
      request.abort();
      setStatus("unavailable");
      return;
    }
    // Match the center square shown by the camera preview's object-fit: cover.
    context.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size,
    );
    setStatus("capturing");
    stopCamera(video);
    canvas.toBlob((image) => {
      if (request.signal.aborted) return;
      if (!image) {
        setStatus("unavailable");
        return;
      }
      closeCamera();
      onCapture(image);
    });
  }

  const label = t("position.camera.open");
  return (
    <>
      <button
        type="button"
        className="board-image-trigger"
        aria-haspopup="dialog"
        aria-label={label}
        title={label}
        onClick={() => void openCamera()}
      >
        <Camera size={17} aria-hidden="true" />
        <span className="board-camera-label">{label}</span>
        <span className="board-camera-short-label">
          {t("position.camera.scan")}
        </span>
      </button>
      <dialog
        ref={dialogRef}
        className="board-camera"
        aria-labelledby="board-camera-title"
        onCancel={(event) => {
          event.preventDefault();
          closeCamera();
        }}
      >
        <div className="board-camera-heading">
          <h2 id="board-camera-title">{label}</h2>
          <button
            type="button"
            className="icon-button"
            aria-label={t("position.camera.close")}
            onClick={closeCamera}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {status === "unavailable" ? (
          <p className="fen-error" role="alert">
            {t("position.camera.unavailable")}
          </p>
        ) : (
          <p className="board-camera-instructions">
            {t("position.camera.frame")}
          </p>
        )}
        <div className="board-camera-preview" hidden={status === "unavailable"}>
          <video ref={videoRef} muted playsInline aria-hidden="true" />
          {status === "opening" ? (
            <span role="status">{t("position.camera.opening")}</span>
          ) : (
            <div className="board-camera-guide" aria-hidden="true" />
          )}
        </div>
        {status !== "unavailable" && (
          <button
            type="button"
            className="new-game-button board-camera-capture"
            disabled={status !== "ready"}
            onClick={captureBoard}
          >
            <Camera size={17} aria-hidden="true" />
            {t("position.camera.capture")}
          </button>
        )}
      </dialog>
    </>
  );
}

import { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const classifyImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const model = await mobilenet.load();

        const predictions = await model.classify(img);

        setResult(predictions);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Image Classifier</h1>

      <input
        type="file"
        accept="image/*"
        onChange={classifyImage}
      />

      {image && (
        <div>
          <img
            id="preview"
            src={image}
            alt="preview"
            width="300"
          />
        </div>
      )}

      {loading && <p>Analyzing image...</p>}

      {result.length > 0 && (
        <div>
          <h2>Predictions</h2>

          {result.map((item, index) => (
            <p key={index}>
              {item.className} -{" "}
              {(item.probability * 100).toFixed(2)}%
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
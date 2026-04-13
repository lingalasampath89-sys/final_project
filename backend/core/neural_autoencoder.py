import numpy as np
import joblib
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
class NeuralXMLAutoencoder:
    """
    Unsupervised Deep Learning Autoencoder for XML Structural Integrity.
    Learns normal latent patterns and detects anomalies based on reconstruction error.
    """
    def __init__(self, input_dim=15):
        self.input_dim = input_dim
        # Deep architecture for latent compression
        self.model = MLPRegressor(
            hidden_layer_sizes=(32, 16, 8, 16, 32),
            activation='relu',
            solver='adam',
            max_iter=500,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.threshold = 0.5 

    def train(self, X):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, X_scaled) # Reconstruct self
        
        # Calculate reconstruction error to set threshold
        reconstructed = self.model.predict(X_scaled)
        mse = np.mean(np.power(X_scaled - reconstructed, 2), axis=1)
        self.threshold = np.mean(mse) + 3 * np.std(mse) # Zero-mean outlier detection
        
    def detect(self, x):
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        reconstructed = self.model.predict(x_scaled)
        mse = np.mean(np.power(x_scaled - reconstructed, 2))
        
        is_anomaly = mse > self.threshold
        confidence = 1.0 - min(1.0, mse / (self.threshold * 2))
        
        return is_anomaly, float(mse), float(confidence)

    def save(self, path):
        joblib.dump({
            "model": self.model,
            "scaler": self.scaler,
            "threshold": self.threshold
        }, path)

    @classmethod
    def load(cls, path):
        data = joblib.load(path)
        obj = cls()
        obj.model = data["model"]
        obj.scaler = data["scaler"]
        obj.threshold = data["threshold"]
        return obj

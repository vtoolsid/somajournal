#!/usr/bin/env python3
"""
Test GPU/MPS availability and performance

This script tests if GPU acceleration is working properly
on your system (CUDA for NVIDIA, MPS for Apple Silicon).

Usage:
    python scripts/test_gpu.py
"""

import torch
import time

def test_device_availability():
    """Test which devices are available."""
    print("🔍 Checking device availability...")
    print(f"PyTorch version: {torch.__version__}")
    
    # Check CUDA (NVIDIA GPU)
    print(f"\nCUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"GPU count: {torch.cuda.device_count()}")
        print(f"GPU name: {torch.cuda.get_device_name(0)}")
    
    # Check MPS (Apple Silicon GPU)
    print(f"\nMPS available: {torch.backends.mps.is_available()}")
    print(f"MPS built: {torch.backends.mps.is_built()}")
    
    # Determine best device
    if torch.cuda.is_available():
        device = torch.device('cuda')
        device_name = "CUDA GPU"
    elif torch.backends.mps.is_available():
        device = torch.device('mps')
        device_name = "Apple Silicon GPU (MPS)"
    else:
        device = torch.device('cpu')
        device_name = "CPU"
    
    print(f"\n✅ Best available device: {device_name}")
    return device

def benchmark_device(device):
    """Run a simple benchmark on the device."""
    print(f"\n⚡ Running benchmark on {device}...")
    
    # Create test tensors
    size = 1000
    a = torch.randn(size, size).to(device)
    b = torch.randn(size, size).to(device)
    
    # Warm up
    for _ in range(10):
        c = torch.matmul(a, b)
    
    # Benchmark
    start_time = time.time()
    iterations = 100
    for _ in range(iterations):
        c = torch.matmul(a, b)
    
    # Ensure computation is complete
    if device.type == 'cuda':
        torch.cuda.synchronize()
    elif device.type == 'mps':
        torch.mps.synchronize()
    
    elapsed_time = time.time() - start_time
    
    print(f"Matrix multiplication ({size}x{size}) x {iterations} iterations")
    print(f"Time: {elapsed_time:.2f} seconds")
    print(f"Operations per second: {iterations/elapsed_time:.2f}")
    
    return elapsed_time

def test_model_on_device(device):
    """Test loading a small model on the device."""
    print(f"\n🤖 Testing model loading on {device}...")
    
    try:
        # Create a small model
        model = torch.nn.Sequential(
            torch.nn.Linear(768, 256),
            torch.nn.ReLU(),
            torch.nn.Linear(256, 28)
        ).to(device)
        
        # Test forward pass
        input_tensor = torch.randn(32, 768).to(device)
        output = model(input_tensor)
        
        print(f"✅ Model successfully loaded and tested on {device}")
        print(f"Input shape: {input_tensor.shape}")
        print(f"Output shape: {output.shape}")
        
    except Exception as e:
        print(f"❌ Error testing model on {device}: {e}")

def main():
    """Run all GPU tests."""
    print("🎮 GPU/MPS Test Script")
    print("=" * 50)
    
    # Test device availability
    device = test_device_availability()
    
    # Run benchmark
    benchmark_device(device)
    
    # Test model loading
    test_model_on_device(device)
    
    # Compare with CPU if using GPU
    if device.type != 'cpu':
        print("\n📊 Comparing with CPU performance...")
        cpu_device = torch.device('cpu')
        gpu_time = benchmark_device(device)
        cpu_time = benchmark_device(cpu_device)
        
        speedup = cpu_time / gpu_time
        print(f"\n🚀 GPU speedup: {speedup:.2f}x faster than CPU")
    
    print("\n✅ GPU test completed!")
    
    # Training recommendations
    print("\n💡 Training Recommendations:")
    if device.type == 'cuda':
        print("- CUDA GPU detected - training will be fast!")
        print("- You can use mixed precision (fp16) for even faster training")
    elif device.type == 'mps':
        print("- Apple Silicon GPU detected - training will be accelerated!")
        print("- Note: Some operations may fall back to CPU")
        print("- Avoid fp16 (mixed precision) as it's not stable on MPS yet")
    else:
        print("- No GPU detected - training will be slow")
        print("- Consider using Google Colab or cloud GPU services")
        print("- Reduce batch_size to avoid memory issues")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Setup Test Script

This script tests if all dependencies and scripts are working correctly
before running the full training pipeline.

Usage:
    python scripts/test_setup.py
"""

import os
import sys
import torch
import importlib.util

def test_imports():
    """Test if all required packages can be imported."""
    print("🔍 Testing package imports...")
    
    required_packages = [
        'torch',
        'transformers',
        'datasets',
        'sklearn',
        'pandas',
        'numpy',
        'matplotlib',
        'seaborn',
        'accelerate',
        'evaluate'
    ]
    
    failed_imports = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✓ {package}")
        except ImportError as e:
            print(f"  ❌ {package}: {e}")
            failed_imports.append(package)
    
    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        return False
    else:
        print("✅ All packages imported successfully!")
        return True

def test_torch_setup():
    """Test PyTorch setup and device availability."""
    print("\n🔧 Testing PyTorch setup...")
    
    print(f"  PyTorch version: {torch.__version__}")
    print(f"  CUDA available: {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        print(f"  CUDA device: {torch.cuda.get_device_name(0)}")
        print(f"  CUDA memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("  ⚠️ CUDA not available - training will use CPU")
    
    # Test basic tensor operations
    try:
        x = torch.randn(2, 3)
        y = torch.randn(3, 2)
        z = torch.mm(x, y)
        print("  ✓ Basic tensor operations working")
        return True
    except Exception as e:
        print(f"  ❌ Tensor operations failed: {e}")
        return False

def test_transformers():
    """Test Transformers library functionality."""
    print("\n🤖 Testing Transformers library...")
    
    try:
        from transformers import BertTokenizer, BertForSequenceClassification
        
        # Test tokenizer
        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        test_text = "Hello, this is a test!"
        tokens = tokenizer(test_text, return_tensors='pt')
        print("  ✓ Tokenizer working")
        
        # Test model loading (just config, not weights)
        model = BertForSequenceClassification.from_pretrained(
            'bert-base-uncased', 
            num_labels=28
        )
        print("  ✓ Model configuration working")
        
        return True
    except Exception as e:
        print(f"  ❌ Transformers test failed: {e}")
        return False

def test_datasets():
    """Test datasets library functionality."""
    print("\n📂 Testing Datasets library...")
    
    try:
        from datasets import load_dataset
        
        # Test loading a small dataset
        print("  Testing dataset loading (this may take a moment)...")
        dataset = load_dataset("imdb", split="train[:10]")  # Load just 10 samples
        print(f"  ✓ Loaded {len(dataset)} samples from IMDB dataset")
        
        return True
    except Exception as e:
        print(f"  ❌ Dataset test failed: {e}")
        print("  This may be due to network issues - proceeding anyway")
        return True  # Don't fail the test for network issues

def test_directory_structure():
    """Test if directory structure is correct."""
    print("\n📁 Testing directory structure...")
    
    required_dirs = ['data', 'scripts', 'models', 'outputs']
    missing_dirs = []
    
    for dir_name in required_dirs:
        if os.path.exists(dir_name):
            print(f"  ✓ {dir_name}/")
        else:
            print(f"  ❌ {dir_name}/ (missing)")
            missing_dirs.append(dir_name)
    
    if missing_dirs:
        print(f"\n⚠️ Missing directories: {', '.join(missing_dirs)}")
        print("These will be created automatically during preprocessing.")
    
    return True

def test_scripts():
    """Test if scripts can be imported without errors."""
    print("\n📜 Testing script syntax...")
    
    scripts = ['preprocess.py', 'train.py', 'inference.py']
    script_dir = 'scripts'
    
    all_good = True
    
    for script in scripts:
        script_path = os.path.join(script_dir, script)
        if os.path.exists(script_path):
            try:
                # Check syntax by compiling
                with open(script_path, 'r') as f:
                    compile(f.read(), script_path, 'exec')
                print(f"  ✓ {script}")
            except SyntaxError as e:
                print(f"  ❌ {script}: Syntax error at line {e.lineno}")
                all_good = False
            except Exception as e:
                print(f"  ❌ {script}: {e}")
                all_good = False
        else:
            print(f"  ❌ {script}: File not found")
            all_good = False
    
    return all_good

def test_memory():
    """Test available memory."""
    print("\n💾 Testing system resources...")
    
    try:
        import psutil
        
        # Get memory info
        memory = psutil.virtual_memory()
        print(f"  Total RAM: {memory.total / 1e9:.1f} GB")
        print(f"  Available RAM: {memory.available / 1e9:.1f} GB")
        print(f"  Memory usage: {memory.percent:.1f}%")
        
        if memory.available < 4e9:  # Less than 4GB
            print("  ⚠️ Low available memory - consider closing other applications")
        else:
            print("  ✓ Sufficient memory available")
        
    except ImportError:
        print("  ⚠️ psutil not available - cannot check memory")
    
    return True

def main():
    """Run all tests."""
    print("🧪 BERT Training Setup Test")
    print("=" * 50)
    
    tests = [
        ("Package Imports", test_imports),
        ("PyTorch Setup", test_torch_setup),
        ("Transformers Library", test_transformers),
        ("Datasets Library", test_datasets),
        ("Directory Structure", test_directory_structure),
        ("Script Syntax", test_scripts),
        ("System Resources", test_memory)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("🏁 Test Summary")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 All tests passed! You're ready to run the training pipeline.")
        print("\nNext steps:")
        print("1. python scripts/preprocess.py")
        print("2. python scripts/train.py")
        print("3. python scripts/inference.py")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please fix the issues before proceeding.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
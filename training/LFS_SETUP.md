# 📦 Git LFS Setup for SomaJournal Model Files

This repository uses Git LFS (Large File Storage) to manage the trained BERT emotion classification model files.

## Why Git LFS?

The trained model (`model.safetensors`) is 418MB, which exceeds GitHub's 100MB file limit. Git LFS allows us to:
- Keep the model in the repository for easy access
- Version control large files efficiently
- Download models only when needed
- Share models seamlessly across the team

## Setup Instructions

### First Time Setup (Team Members)

1. **Install Git LFS** (if not already installed):
   ```bash
   # macOS
   brew install git-lfs
   
   # Ubuntu/Debian
   sudo apt-get install git-lfs
   
   # Windows
   # Download from: https://git-lfs.github.io/
   ```

2. **Initialize LFS in your local repository**:
   ```bash
   git lfs install
   ```

3. **Download the model files**:
   ```bash
   git lfs pull
   ```

4. **Verify model files are downloaded**:
   ```bash
   ls -la training/models/bert_emotion_model/
   # Should show model.safetensors as 418MB
   ```

### For New Repository Clones

When cloning the repository for the first time:

```bash
# Clone with LFS files
git clone https://github.com/your-username/karmicwellnessappv1.git
cd karmicwellnessappv1

# Install LFS and download model files
git lfs install
git lfs pull

# Verify model is ready
python -c "import os; print('Model ready!' if os.path.exists('training/models/bert_emotion_model/model.safetensors') else 'Model missing - run git lfs pull')"
```

## LFS-Tracked Files

The following files are managed by Git LFS:

- `*.safetensors` - Model weight files
- `training/models/**` - All model directory files

You can see what's tracked with:
```bash
git lfs ls-files
```

## Using the Model

Once LFS is set up, use the model normally:

```python
from training.scripts.inference import EmotionClassifier

# This will work once LFS files are downloaded
classifier = EmotionClassifier(model_path='training/models/bert_emotion_model')
result = classifier.classify_emotion("I feel great today!")
```

## GitHub LFS Billing

- **Free tier**: 1GB storage, 1GB bandwidth per month
- **Paid plan**: $5/month for 50GB bandwidth, 50GB storage
- Our model: ~418MB storage, bandwidth depends on downloads

## Troubleshooting

### Model file appears as text pointer
If `model.safetensors` is only a few KB and contains text like `version https://git-lfs.github.com/spec/v1`:

```bash
git lfs pull
```

### LFS not tracking new large files
```bash
git lfs track "*.safetensors"
git add .gitattributes
git add your_large_file.safetensors
```

### Check LFS status
```bash
git lfs status
git lfs ls-files
```

### Large file accidentally committed to git (not LFS)
```bash
# Remove from git history and add to LFS
git lfs migrate import --include="*.safetensors"
```

## Development Workflow

1. **Modify model**: If you retrain the model, the new files will automatically be LFS-tracked
2. **Commit changes**: `git add` and `git commit` work normally
3. **Push**: LFS files are uploaded automatically with `git push`
4. **Pull updates**: Team members use `git pull` + `git lfs pull` to get new model versions

## Alternative: Download from Backup

If LFS isn't working, you can manually download the model from our backup:

1. Download from: `/Users/virtoolsidass/Downloads/SomaJournal_Training_Backup/`
2. Copy `bert_emotion_model/` to `training/models/`
3. Verify with: `ls -la training/models/bert_emotion_model/model.safetensors`

---

**Note**: This setup ensures the SomaJournal app can access the trained emotion classification model while keeping the repository GitHub-compatible.
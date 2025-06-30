# 🔄 Resuming BERT Training

This guide explains how to resume training from checkpoints when training is interrupted.

## How Checkpoints Work

The training script automatically saves checkpoints every 500 steps:
- Saved to: `outputs/training_results/checkpoint-XXX/`
- Includes model weights, optimizer state, and training progress
- Keeps only the 3 most recent checkpoints to save space

## Resume Training

### 1. Activate Environment
```bash
cd training
source venv/bin/activate
```

### 2. Resume from Latest Checkpoint
```bash
python scripts/train.py
```

The script will automatically:
- ✅ Find the latest checkpoint
- ✅ Load model weights and optimizer state
- ✅ Continue from the exact step where you stopped
- ✅ Preserve all training metrics

**Example Output:**
```
📂 Found checkpoint: outputs/training_results/checkpoint-1500
🔄 Resuming training from checkpoint...
```

### 3. Start Fresh Training (Optional)
If you want to ignore checkpoints and start over:
```bash
python scripts/train.py --fresh
```

## Check Training Progress

### View Checkpoints
```bash
ls outputs/training_results/
```

### Monitor with TensorBoard (Optional)
```bash
tensorboard --logdir outputs/training_logs
```

## Common Scenarios

### Scenario 1: Training Interrupted by System
Simply run `python scripts/train.py` - it will resume automatically.

### Scenario 2: Out of Memory Error
1. Reduce batch size in `config.yaml`
2. Run `python scripts/train.py` to resume with new settings

### Scenario 3: Want to Try Different Settings
1. Modify `config.yaml` with new hyperparameters
2. Run `python scripts/train.py --fresh` to start over

### Scenario 4: Training Completed but Want More Epochs
1. Edit `num_train_epochs` in train.py or config.yaml
2. Run `python scripts/train.py` to continue training

## Checkpoint Structure

Each checkpoint contains:
```
checkpoint-XXX/
├── config.json              # Model configuration
├── model.safetensors       # Model weights
├── optimizer.pt            # Optimizer state
├── scheduler.pt            # Learning rate scheduler
├── trainer_state.json      # Training progress
└── training_args.bin       # Training arguments
```

## Tips

1. **Save Power**: Training resumes exactly where it stopped, preserving GPU hours
2. **Experiment Safely**: Checkpoints let you try different settings without losing progress
3. **Best Model**: The script automatically saves the best model based on F1 score
4. **Clean Up**: Old checkpoints are automatically deleted (keeps only 3 most recent)

## Troubleshooting

**"No checkpoints found"**
- First time training or used `--fresh` flag
- Check if `outputs/training_results/` exists

**"CUDA out of memory"**
- Reduce batch_size before resuming
- Training will continue with new batch size

**"Checkpoint corrupted"**
- Delete the corrupted checkpoint folder
- Script will use previous checkpoint or start fresh

## Quick Reference

```bash
# Resume training
python scripts/train.py

# Start fresh
python scripts/train.py --fresh

# Check progress
ls -la outputs/training_results/

# View latest checkpoint
ls outputs/training_results/checkpoint-*/
```
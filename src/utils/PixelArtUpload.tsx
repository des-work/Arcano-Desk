/**
 * Pixel Art Upload System
 * Easy upload and management of pixel art sprites for the wizard
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, Eye, Edit3 } from 'lucide-react';

export interface PixelArtSprite {
  id: string;
  name: string;
  animation: string;
  frame: number;
  data: string; // Base64 or pixel data
  width: number;
  height: number;
  uploadedAt: Date;
}

export interface PixelArtUploadProps {
  onSpriteUploaded?: (sprite: PixelArtSprite) => void;
  onSpriteDeleted?: (spriteId: string) => void;
  className?: string;
}

export const PixelArtUpload: React.FC<PixelArtUploadProps> = ({
  onSpriteUploaded,
  onSpriteDeleted,
  className = '',
}) => {
  const [sprites, setSprites] = useState<PixelArtSprite[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState<PixelArtSprite | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          continue;
        }

        // Read file as base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Create sprite object
        const sprite: PixelArtSprite = {
          id: `sprite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          animation: 'idle', // Default animation
          frame: 0,
          data: base64,
          width: 16, // Default 16x16
          height: 16,
          uploadedAt: new Date(),
        };

        // Add to sprites
        setSprites(prev => [...prev, sprite]);
        
        if (onSpriteUploaded) {
          onSpriteUploaded(sprite);
        }

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setIsUploading(false);
  }, [onSpriteUploaded]);

  // Delete sprite
  const deleteSprite = useCallback((spriteId: string) => {
    setSprites(prev => prev.filter(s => s.id !== spriteId));
    
    if (onSpriteDeleted) {
      onSpriteDeleted(spriteId);
    }
  }, [onSpriteDeleted]);

  // Update sprite properties
  const updateSprite = useCallback((spriteId: string, updates: Partial<PixelArtSprite>) => {
    setSprites(prev => prev.map(s => 
      s.id === spriteId ? { ...s, ...updates } : s
    ));
  }, []);

  // Export sprite as JSON
  const exportSprite = useCallback((sprite: PixelArtSprite) => {
    const dataStr = JSON.stringify(sprite, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sprite.name}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Section */}
      <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-wizard text-purple-200 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Pixel Art
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-purple-400/50 rounded-lg p-8 text-center hover:border-purple-400/80 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="pixel-art-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="pixel-art-upload"
              className="cursor-pointer block"
            >
              <div className="text-4xl mb-4">🎨</div>
              <div className="text-purple-200 font-wizard mb-2">
                {isUploading ? 'Uploading...' : 'Click to upload pixel art'}
              </div>
              <div className="text-purple-300/70 text-sm">
                Supports PNG, JPG, GIF (16x16 recommended)
              </div>
            </label>
          </div>

          <div className="text-purple-300/70 text-sm">
            <strong>Tips for best results:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Use 16x16 pixel dimensions for crisp display</li>
              <li>Save as PNG for transparency support</li>
              <li>Use limited color palette for retro feel</li>
              <li>Name files descriptively (e.g., wizard_idle_01.png)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sprite Library */}
      {sprites.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-xl font-wizard text-cyan-200 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Sprite Library ({sprites.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sprites.map((sprite) => (
              <motion.div
                key={sprite.id}
                className="bg-black/20 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {/* Sprite Preview */}
                <div className="mb-3 flex justify-center">
                  <img
                    src={sprite.data}
                    alt={sprite.name}
                    className="w-16 h-16 image-rendering-pixelated border border-cyan-400/30 rounded"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* Sprite Info */}
                <div className="text-center mb-3">
                  <div className="text-cyan-200 font-wizard text-sm mb-1">
                    {sprite.name}
                  </div>
                  <div className="text-cyan-300/70 text-xs">
                    {sprite.width}x{sprite.height} • {sprite.animation}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setSelectedSprite(sprite)}
                    className="p-2 bg-cyan-600/50 hover:bg-cyan-500/50 rounded text-cyan-200 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => exportSprite(sprite)}
                    className="p-2 bg-green-600/50 hover:bg-green-500/50 rounded text-green-200 transition-colors"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteSprite(sprite.id)}
                    className="p-2 bg-red-600/50 hover:bg-red-500/50 rounded text-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sprite Detail Modal */}
      {selectedSprite && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedSprite(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-purple-800/90 to-pink-800/90 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-wizard text-purple-200 mb-4">
              Sprite Details
            </h3>
            
            <div className="space-y-4">
              {/* Large Preview */}
              <div className="flex justify-center">
                <img
                  src={selectedSprite.data}
                  alt={selectedSprite.name}
                  className="w-32 h-32 image-rendering-pixelated border border-purple-400/30 rounded"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Properties */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-300">Name:</span>
                  <span className="text-purple-200">{selectedSprite.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Size:</span>
                  <span className="text-purple-200">{selectedSprite.width}x{selectedSprite.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Animation:</span>
                  <span className="text-purple-200">{selectedSprite.animation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Frame:</span>
                  <span className="text-purple-200">{selectedSprite.frame}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setSelectedSprite(null)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-wizard rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => exportSprite(selectedSprite)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-wizard rounded-lg hover:bg-green-500 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Hook for managing pixel art sprites
 */
export function usePixelArtSprites() {
  const [sprites, setSprites] = useState<PixelArtSprite[]>([]);

  const addSprite = (sprite: PixelArtSprite) => {
    setSprites(prev => [...prev, sprite]);
  };

  const removeSprite = (spriteId: string) => {
    setSprites(prev => prev.filter(s => s.id !== spriteId));
  };

  const updateSprite = (spriteId: string, updates: Partial<PixelArtSprite>) => {
    setSprites(prev => prev.map(s => 
      s.id === spriteId ? { ...s, ...updates } : s
    ));
  };

  const getSpritesByAnimation = (animation: string) => {
    return sprites.filter(s => s.animation === animation);
  };

  return {
    sprites,
    addSprite,
    removeSprite,
    updateSprite,
    getSpritesByAnimation,
  };
}

export default PixelArtUpload;

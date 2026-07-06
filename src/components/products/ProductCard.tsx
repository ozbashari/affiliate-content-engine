"use client";

import { useState } from 'react';
import { CatalogProduct } from '@/features/products/types';
import { GeneratedPost } from '@/features/ai/types';

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [postPreview, setPostPreview] = useState<GeneratedPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Telegram publishing states
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishMessageId, setPublishMessageId] = useState<string | null>(null);

  const rating = product.rating !== undefined ? product.rating.toFixed(1) : 'N/A';
  const commission = product.commissionRate !== undefined ? `${product.commissionRate}%` : 'N/A';

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    setPostPreview(null);
    setPublishSuccess(false);
    setPublishError(null);
    setPublishMessageId(null);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product }),
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
      }

      setPostPreview(data.post);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!postPreview) return;
    setPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);
    setPublishMessageId(null);
    try {
      const response = await fetch('/api/publish/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: postPreview }),
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
      }

      setPublishSuccess(true);
      setPublishMessageId(data.messageId);
    } catch (err: any) {
      setPublishError(err instanceof Error ? err.message : String(err));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden duration-300">
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain max-h-[220px]"
        />
        {product.discountPercent !== undefined && product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[40px]" title={product.title}>
          {product.title}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {product.price.amount.toFixed(2)} {product.price.currency}
          </span>
          {product.originalPrice && product.originalPrice.amount > product.price.amount && (
            <span className="text-xs text-gray-400 line-through">
              {product.originalPrice.amount.toFixed(2)} {product.originalPrice.currency}
            </span>
          )}
        </div>

        {/* Specs Table/List */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-500 font-bold">★</span>
            <span>Rating: <strong className="text-gray-900">{rating}</strong></span>
          </div>
          <div>
            Sales: <strong className="text-gray-900">{product.salesCount ?? 0}</strong>
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <span className="text-green-600 font-bold">%</span>
            <span>Commission: <strong className="text-green-700">{commission}</strong></span>
          </div>
        </div>

        {/* Affiliate Button & Preview Button */}
        <div className="mt-auto flex flex-col gap-2">
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 shadow-sm"
          >
            Buy on AliExpress
          </a>
          <button
            onClick={handlePreview}
            disabled={loading || publishing}
            className={`w-full text-center bg-gray-100 hover:bg-gray-250 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 border border-gray-200 flex items-center justify-center gap-1.5 ${
              loading || publishing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              'Preview Post'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {postPreview && (
          <div className="mt-4 border-t border-gray-100 pt-4 text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-xs">Post Preview (Hebrew):</span>
              <button 
                onClick={() => {
                  setPostPreview(null);
                  setPublishSuccess(false);
                  setPublishError(null);
                }} 
                className="text-gray-400 hover:text-gray-600 font-bold"
                title="Close Preview"
                disabled={publishing}
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-50 border border-gray-150 p-3 rounded-xl text-gray-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
              {postPreview.fullText}
            </div>

            {/* Action buttons inside the preview area */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`w-full text-center bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1 ${
                  publishing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {publishing ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </button>
            </div>

            {publishError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-[10px] rounded-lg border border-red-200">
                <strong>Publish Error:</strong> {publishError}
              </div>
            )}

            {publishSuccess && (
              <div className="p-2.5 bg-green-50 text-green-700 text-[10px] rounded-lg border border-green-200">
                <strong>Published!</strong> Message ID: {publishMessageId}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

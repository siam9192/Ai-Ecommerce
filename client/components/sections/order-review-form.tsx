"use client";

import { useId, useState, type FormEvent } from "react";
import { FiStar } from "react-icons/fi";
import { addProductReview } from "@/api-services/reviews.api.services";

interface OrderReviewFormProps {
  productId: number;
  productName: string;
  reviewed: boolean;
  canReview: boolean;
  onSubmitted: (productId: number) => void;
}

export default function OrderReviewForm({
  productId,
  productName,
  reviewed,
  canReview,
  onSubmitted,
}: OrderReviewFormProps) {
  const commentId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    try {
      const response = await addProductReview({
        product_id: productId,
        rating,
        comment: comment.trim() || undefined,
      });
      if (!response.success) {
        throw new Error(response.message || "Unable to submit your review.");
      }
      onSubmitted(productId);
      setIsOpen(false);
    } catch (submitError) {
      console.error("Failed to submit product review:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviewed) {
    return (
      <span className="text-xs font-medium text-emerald-700">Reviewed</span>
    );
  }

  if (!canReview) {
    return (
      <span className="text-xs text-slate-500">Review after delivery</span>
    );
  }

  return (
    <div className="mt-2">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-sm font-semibold text-primary transition hover:text-primary-hover"
          aria-label={`Review ${productName}`}
        >
          Write a review
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-3 max-w-lg rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-sm font-semibold text-slate-900">
            Review {productName}
          </p>
          <div
            className="mt-3 flex items-center gap-1"
            role="group"
            aria-label="Rating"
          >
            {Array.from({ length: 5 }, (_, index) => {
              const starRating = index + 1;
              return (
                <button
                  key={starRating}
                  type="button"
                  onClick={() => setRating(starRating)}
                  aria-label={`Rate ${starRating} ${
                    starRating === 1 ? "star" : "stars"
                  }`}
                  aria-pressed={rating === starRating}
                  className="rounded p-1 text-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <FiStar
                    size={20}
                    className={starRating <= rating ? "fill-current" : ""}
                  />
                </button>
              );
            })}
          </div>
          <label
            htmlFor={commentId}
            className="mt-3 block text-sm font-medium text-slate-700"
          >
            Comment <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id={commentId}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={2000}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {error && (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError("");
              }}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

import React from "react";
import { Review } from "@/types/review.type";
import { FiStar, FiThumbsUp } from "react-icons/fi";

interface ReviewsProps {
  reviews?: Review[];
  productRating: number;
}

export default function ReviewsSection({
  reviews = [],
  productRating,
}: ReviewsProps) {
  const totalReviews = reviews.length;
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const getRatingPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="mb-8 text-2xl font-bold text-foreground">
        Customer Reviews
      </h2>

      {totalReviews === 0 ? (
        <div className="rounded-lg bg-muted p-8 text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Rating Summary */}
          <div className="rounded-lg bg-card p-6 border border-border md:col-span-1">
            <div className="mb-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-foreground">
                  {productRating.toFixed(1)}
                </span>
                <FiStar className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground w-8">
                    {stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{
                        width: `${getRatingPercentage(ratingDistribution[stars as keyof typeof ratingDistribution])}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {getRatingPercentage(
                      ratingDistribution[
                        stars as keyof typeof ratingDistribution
                      ],
                    )}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4 md:col-span-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border bg-card p-6"
              >
                {/* Review Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {review.author}
                      </span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <h4 className="mb-2 font-semibold text-foreground">
                  {review.title}
                </h4>

                {/* Review Content */}
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {review.content}
                </p>

                {/* Helpful Button */}
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
                  <FiThumbsUp size={16} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

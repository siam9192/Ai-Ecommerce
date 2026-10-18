import type { ProductReview } from "@/types/review.type";
import { FiCheck, FiStar } from "react-icons/fi";

interface ReviewsProps {
  reviews: ProductReview[];
  productRating: number;
  unavailable?: boolean;
}

export default function ReviewsSection({
  reviews,
  productRating,
  unavailable = false,
}: ReviewsProps) {
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Math.round(review.rating) === rating)
      .length,
  }));

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mt-16 border-t border-slate-200 pt-10"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
          Real customer feedback
        </p>
        <h2
          id="reviews-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-slate-950"
        >
          Customer reviews
        </h2>
      </div>

      {unavailable ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900"
        >
          Reviews are temporarily unavailable. Please try again later.
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
            <FiStar size={22} />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No reviews yet
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Be the first to share your experience with this product.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Average customer rating
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-5xl font-bold tracking-tight text-slate-950">
                {productRating.toFixed(1)}
              </span>
              <div>
                <div
                  className="flex text-amber-400"
                  aria-label={`${productRating.toFixed(1)} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar
                      key={index}
                      size={16}
                      className={
                        index < Math.round(productRating) ? "fill-current" : ""
                      }
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {ratingCounts.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium text-slate-600">
                    {rating} star
                  </span>
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label={`${count} ${rating}-star ${
                      count === 1 ? "review" : "reviews"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width: `${(count / reviews.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-5 text-right text-xs text-slate-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Customer
                    </h3>
                    <time
                      dateTime={review.created_at}
                      className="mt-1 block text-xs text-slate-500"
                    >
                      {new Date(review.created_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex text-amber-400"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <FiStar
                          key={index}
                          size={15}
                          className={
                            index < Math.round(review.rating)
                              ? "fill-current"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </span>
                    {review.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <FiCheck size={13} />
                        Verified purchase
                      </span>
                    )}
                  </div>
                </div>
                {review.comment ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {review.comment}
                  </p>
                ) : (
                  <p className="mt-4 text-sm italic text-slate-500">
                    This customer left a rating without a written comment.
                  </p>
                )}
                {review.reaction_type && (
                  <p className="mt-4 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium capitalize text-indigo-700">
                    {review.reaction_type}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

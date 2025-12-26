import {
  PaperAirplaneIcon,
  PencilSquareIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import type { Review } from "../../types/review.types";
import { reviews } from "../../api";

interface ReviewFormToggleProps {
  id: string;
  review: Review | null;
  setReview: React.Dispatch<React.SetStateAction<Review | null>>;
}

export const ReviewFormToggle: React.FC<ReviewFormToggleProps> = ({
  id,
  review,
  setReview,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(review ? review.rating : 0);
  const [comment, setComment] = useState(review ? review.comment : "");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      let data: Review;
      if (review) {
        data = await reviews.update(review.id, {
          rating,
          comment: comment.trim(),
        });
      } else {
        data = await reviews.create({
          repairOrderId: id,
          rating,
          comment: comment.trim(),
        });
        alert("¡Gracias por tu reseña!");
      }
      setReview(data);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar la reseña");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all">
      {/* Si existe una reseña y no se está editando */}
      {review && !showReviewForm ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Tu reseña</h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Editar reseña"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Estrellas */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={star <= review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      ) : showReviewForm ? (
        /* Formulario para crear o editar reseña */
        <form
          onSubmit={handleSubmitReview}
          className="space-y-6 animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <PencilSquareIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                {review ? "Edita tu Reseña" : "Califica el Servicio"}
              </h3>
              <p className="text-gray-500 text-sm">
                Tu opinión nos ayuda a mejorar la experiencia.
              </p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Calificación
            </label>
            <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="transition-transform hover:scale-125"
                  value={review ? review.rating : rating}
                >
                  <StarIcon
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Comentario
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
              placeholder="Cuéntanos sobre tu experiencia con el servicio..."
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              disabled={submittingReview}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submittingReview || !comment.trim()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${
                submittingReview
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              {submittingReview
                ? "Enviando..."
                : review
                ? "Guardar Cambios"
                : "Enviar Reseña"}
            </button>
          </div>
        </form>
      ) : (
        /* No hay reseña ni formulario, mostrar botón para crear */
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <StarIcon className="w-5 h-5" />
          Dejar una Reseña
        </button>
      )}
    </div>
  );
};

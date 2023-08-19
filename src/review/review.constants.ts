export const REVIEW_NOT_FOUND = "Отзыв с таким id не найден";
export const RATING_MAX_VALUE_ERROR = "Рейтинг не должен быть выше 5";
export const RATING_MIN_VALUE_ERROR = "Рейтинг должен быть не ниже 1";
export const REVIEW_DELETE_SUCCESS = (id: string) =>
  `Отзыв с id: ${id} успешно удален`;

export const USERNAME_MIN_LENGTH = 5;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX = new RegExp(/^(?=.*\d)[A-Za-z\d@$!%*?&]{10,}$/);
export const PASSWORD_REGEX_ERROR =
  "Password must be at least 10 characters long and must contain at least one number.";

export const TWEETS_PER_PAGE = 5;
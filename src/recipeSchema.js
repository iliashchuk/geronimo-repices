const isDefinedNonemnptyString = (value) => value && typeof value === "string";
const isDefinedNonemnptyNumber = (value) => value && typeof value === "number";

module.exports = {
  id: {
    isEmpty: true,
    errorMessage: "Don't provide an ID"
  },
  name: {
    isString: true,
    errorMessage: "Must be a string"
  },
  image: {
    isString: true,
    errorMessage: "Must be a string"
  },
  categories: {
    isArray: {
      options: {
        min: 1
      }
    },
    errorMessage: "Must be a non-empty array",
    custom: {
      options: (categories) =>
        categories &&
        categories.every((category) => typeof category === "string"),
      errorMessage: "Must be an array of strings"
    }
  },
  duration: {
    isInt: true,
    errorMessage: "Must be an integer"
  },
  portions: {
    isInt: true,
    errorMessage: "Must be an integer"
  },
  ingredients: {
    isArray: {
      options: {
        min: 1
      }
    },
    errorMessage: "Must be a non-empty array",
    custom: {
      options: (ingredients) =>
        ingredients &&
        ingredients.every((ingredient) => {
          if (isDefinedNonemnptyString(ingredient.name)) {
            return true;
          }
          return false;
        }),
      errorMessage:
        "Must be an array of {name: string, unit?: string, value?: number}"
    }
  },
  autor: {
    isString: true,
    errorMessage: "Must be a string"
  },
  description: {
    isArray: {
      options: {
        min: 1
      }
    },
    errorMessage: "Must be a non-empty array",
    custom: {
      options: (ingredients) =>
        ingredients &&
        ingredients.every((ingredient) => {
          if (isDefinedNonemnptyString(ingredient.descriptionText)) {
            return true;
          }
          return false;
        }),
      errorMessage:
        "Must be an array of {descriptionText: string, image?: string}"
    }
  }
};

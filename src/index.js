const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4 } = require('uuid');
const { checkSchema, validationResult } = require('express-validator');

const recipeSchema = require('./recipeSchema');

const PORT = process.env.PORT || 5000;

const dirname = path.dirname(process.mainModule.filename);

const recipesFilename = path.join(dirname, 'data/recipes.json');
const defaultRecipesFilename = path.join(dirname, 'data/defaultRecipes.json');
const categoriesFilename = path.join(dirname, 'data/categories.json');

const defaultCategories = [
  'Italian cuisine',
  'Lazagna',
  'Meat',
  'Soup',
  'French',
  'Cheese dishes',
];

const readCategoriesFormFile = () => {
  return JSON.parse(fs.readFileSync(categoriesFilename, { encoding: 'utf-8' }));
};

const writeCategoriesToFile = (categories) => {
  fs.writeFileSync(categoriesFilename, JSON.stringify(categories));
};

const readRecipesFormFile = () => {
  return JSON.parse(fs.readFileSync(recipesFilename, { encoding: 'utf-8' }));
};

const writeRecipesToFile = (recipes) => {
  fs.writeFileSync(recipesFilename, JSON.stringify(recipes));
};

const app = express();

app.use(bodyParser.json());
app.use(cors());

app
  .get('/categories', (_req, res) => {
    res.send(readCategoriesFormFile());
  })
  .get('/recipes', (req, res) => {
    const { filter, search } = req.query;
    const recipes = readRecipesFormFile();

    res.send(
      recipes.filter((recipe) => {
        let satisfiesFilter = true;
        let satisfiesSearch = true;
        if (filter) {
          if (Array.isArray(filter)) {
            satisfiesFilter = filter.some((category) => {
              console.log(recipe.categories, category);
              return recipe.categories.includes(category);
            });
          } else {
            satisfiesFilter = recipe.categories.includes(filter);
          }
        }
        if (search) {
          satisfiesSearch = recipe.name
            .toLowerCase()
            .includes(search.toLowerCase());
        }
        return satisfiesFilter && satisfiesSearch;
      })
    );
  })
  .get('/recipe/:id', (req, res) => {
    res.send(
      readRecipesFormFile(req.params.id).find(({ id }) => id === req.params.id)
    );
  })
  .post('/reset', (_req, res) => {
    const defaultRecipes = JSON.parse(
      fs.readFileSync(defaultRecipesFilename, { encoding: 'utf-8' })
    );

    writeRecipesToFile(defaultRecipes);
    writeCategoriesToFile(defaultCategories);
    res.send(readRecipesFormFile());
  })
  .post('/recipe', checkSchema(recipeSchema), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newRecipe = req.body;
    const currentRecipes = readRecipesFormFile();
    const currentCategories = readCategoriesFormFile();

    writeRecipesToFile([...currentRecipes, { id: v4(), ...newRecipe }]);
    writeCategoriesToFile(
      [...currentCategories, ...newRecipe.categories].filter(
        (value, index, self) => {
          return self.indexOf(value) === index;
        }
      )
    );
    res.send(readRecipesFormFile());
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

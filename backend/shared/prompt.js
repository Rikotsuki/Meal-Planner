 const getGenerateMealPlanPrompt = (profile) => {
 return `plese generate meal plan for the user data provided below inside below xml .

<ProfileData>
    ${profile}
</ProfileData>
 Please generate for seven days . Data of each day must look like the json inside below xml .
 <ExampleData>
 {
  'date': '2025-08-03',
  'caloriesTotal': 2463,
  'meals': [
    {
      'name': 'Breakfast',
      'calories': 770,
      'items': [
        {
          'name': 'Chocolate Peanut Butter Oatmeal Protein Shake',
          'servings': 2,
          'image': 'chocolate_peanut_shake.jpg'
        },
        {
          'name': 'Cottage Cheese & Apricots',
          'servings': 0.5,
          'image': 'cottage_cheese_apricots.jpg'
        }
      ]
    },
    {
      'name': 'Lunch',
      'calories': 516,
      'items': [
        {
          'name': 'Vegan Tu-nah',
          'servings': 2,
          'image': 'vegan_tunah.jpg'
        },
        {
          'name': 'Vegan Tofu Egg Salad',
          'servings': 1,
          'image': 'vegan_tofu_egg_salad.jpg'
        }
      ]
    },
    {
      'name': 'Dinner',
      'calories': 912,
      'items': [
        {
          'name': 'One Pan Balsamic ChiQin and Veggies',
          'servings': 1.25,
          'image': 'balsamic_chiqin.jpg'
        },
        {
          'name': 'Strawberry and Walnut Spinach Salad',
          'servings': 0.25,
          'image': 'spinach_salad.jpg'
        }
      ]
    },
    {
      'name': 'Snack',
      'calories': 264,
      'items': [
        {
          'name': 'Red Bell Pepper, Carrots, and Peanut Butter',
          'servings': 1,
          'image': 'bell_pepper_snack.jpg'
        }
      ]
    }
  ],
  'nutrition': {
    'totals': {
      'calories': 2463,
      'carbs': 230,
      'fat': 108.5,
      'protein': 180.2,
      'fiber': 65,
      'sodium': 4852,
      'cholesterol': 11
    },
    'targets': {
      'calories': 2463,
      'carbs': { 'min': 80, 'max': 308 },
      'fat': { 'min': 50, 'max': 137 },
      'protein': { 'min': 65, 'max': 308 },
      'fiber': 25
    },
    'macrosPercent': {
      'fat': 37,
      'carbs': 35,
      'protein': 28
    }
  }
}
</ExampleData>
. Generate data for seven days as an array of object 
`

  }
  module.exports = { getGenerateMealPlanPrompt };
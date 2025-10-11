import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, ChefHat } from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Sample recipe data - in real app, this would come from a database
  const recipe = {
    id: '1',
    name: 'Quick Pasta Carbonara',
    nameEl: 'Γρήγορη Καρμπονάρα',
    time: 15,
    difficulty: 'easy',
    image: '🍝',
    ingredients: [
      '200g pasta',
      '2 eggs',
      '100g bacon or pancetta',
      '50g parmesan cheese',
      'Black pepper',
      'Salt',
    ],
    ingredientsEl: [
      '200γρ ζυμαρικά',
      '2 αυγά',
      '100γρ μπέικον',
      '50γρ παρμεζάνα',
      'Μαύρο πιπέρι',
      'Αλάτι',
    ],
    instructions: [
      'Boil pasta according to package directions',
      'Fry bacon until crispy',
      'Beat eggs with cheese',
      'Drain pasta, mix with bacon',
      'Remove from heat, add egg mixture',
      'Toss quickly and serve immediately',
    ],
    instructionsEl: [
      'Βράστε τα ζυμαρικά σύμφωνα με τις οδηγίες',
      'Τηγανίστε το μπέικον μέχρι να γίνει τραγανό',
      'Χτυπήστε τα αυγά με το τυρί',
      'Στραγγίξτε τα ζυμαρικά, ανακατέψτε με το μπέικον',
      'Αφαιρέστε από τη φωτιά, προσθέστε το μείγμα αυγών',
      'Ανακατέψτε γρήγορα και σερβίρετε αμέσως',
    ],
  };

  const ingredients = i18n.language === 'el' ? recipe.ingredientsEl : recipe.ingredients;
  const instructions = i18n.language === 'el' ? recipe.instructionsEl : recipe.instructions;
  const name = i18n.language === 'el' ? recipe.nameEl : recipe.name;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/recipes')}
        className="gap-2 text-primary hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>

      {/* Recipe Header */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-3 text-primary">{name}</CardTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.time} {t('recipes.time')}</span>
                </div>
                <Badge variant="secondary">
                  {t(`recipes.difficulty.${recipe.difficulty}`)}
                </Badge>
              </div>
            </div>
            <div className="text-6xl">{recipe.image}</div>
          </div>
        </CardHeader>
      </Card>

      {/* Ingredients */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <ChefHat className="h-5 w-5 text-accent" />
            {t('recipes.ingredients')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{t('recipes.instructions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Start Cooking Button */}
      <Button className="w-full h-12 text-lg bg-accent text-primary hover:bg-accent/90 shadow-gold">
        {t('recipes.startCooking')} 👨‍🍳
      </Button>
    </div>
  );
};

export default RecipeDetail;

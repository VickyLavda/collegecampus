import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat } from 'lucide-react';
import { recipes } from '@/data/recipes';

const Recipes = () => {
  const { t, i18n } = useTranslation();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'hard':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <ChefHat className="h-8 w-8 text-accent" />
          {t('recipes.title')}
        </h1>
        <p className="text-muted-foreground">{t('recipes.subtitle')}</p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
            <Card className="hover:shadow-medium transition-smooth cursor-pointer border-2 hover:border-accent h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-foreground">
                      {i18n.language === 'el' ? recipe.nameEl : recipe.name}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.time} {t('recipes.time')}</span>
                      </div>
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {t(`recipes.difficulty.${recipe.difficulty}`)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-5xl">{recipe.image}</div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recipes;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, ChefHat, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { recipes } from '@/data/recipes';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Find the recipe by ID
  const recipe = recipes.find(r => r.id === id);

  // If recipe not found, redirect back
  if (!recipe) {
    navigate('/recipes');
    return null;
  }

  const ingredients = i18n.language === 'el' ? recipe.ingredientsEl : recipe.ingredients;
  const instructions = i18n.language === 'el' ? recipe.instructionsEl : recipe.instructions;
  const name = i18n.language === 'el' ? recipe.nameEl : recipe.name;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const startCookingMode = () => {
    setCookingMode(true);
    setCurrentStep(0);
    setTimeRemaining(recipe.time * 60); // Convert minutes to seconds
    setTimerRunning(true);
  };

  const exitCookingMode = () => {
    setCookingMode(false);
    setCurrentStep(0);
    setTimerRunning(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / instructions.length) * 100;

  // Cooking Mode View
  if (cookingMode) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Cooking Mode Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={exitCookingMode}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('common.exit')}
          </Button>
          <div className="flex items-center gap-2 text-lg font-bold">
            <Clock className="h-5 w-5 text-accent" />
            <span className={timeRemaining < 60 ? 'text-destructive' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('recipes.step')} {currentStep + 1} {t('common.of')} {instructions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step Card */}
        <Card className="flex-1 shadow-strong">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-accent text-primary flex items-center justify-center text-2xl font-bold mb-6">
              {currentStep + 1}
            </div>
            <p className="text-xl leading-relaxed">
              {instructions[currentStep]}
            </p>
          </CardContent>
        </Card>

        {/* Timer Controls */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTimerRunning(!timerRunning)}
          >
            {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTimeRemaining(recipe.time * 60)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={currentStep === 0}
            className="flex-1 gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.previous')}
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === instructions.length - 1}
            className="flex-1 gap-2 bg-accent text-primary hover:bg-accent/90"
          >
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {currentStep === instructions.length - 1 && (
          <Button
            onClick={exitCookingMode}
            className="w-full bg-accent text-primary hover:bg-accent/90"
          >
            {t('recipes.finishCooking')} ✨
          </Button>
        )}
      </div>
    );
  }

  // Normal Recipe View
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
      <Button 
        onClick={startCookingMode}
        className="w-full h-12 text-lg bg-accent text-primary hover:bg-accent/90 shadow-gold"
      >
        {t('recipes.startCooking')} 👨‍🍳
      </Button>
    </div>
  );
};

export default RecipeDetail;

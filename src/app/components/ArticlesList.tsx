"use client";

import React from "react";
import { Article } from "@/app/DashboardAdministrateur/hooks/useArticles";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import EvaluationForm from "@/app/components/EvaluationArticle";

interface ArticlesListProps {
  articles: Article[];
  selectedCategory?: string | null;
  onArticleClick: (articleId: string) => void;
  onRefetchMoyenne: (catId: string, artId: string) => void;
  onDeleteArticle: (article: Article) => void; // ajouté pour centraliser la suppression
}

const ArticlesList: React.FC<ArticlesListProps> = ({
  selectedCategory,
  articles,
  onArticleClick,
  onRefetchMoyenne,
  onDeleteArticle,
}) => {
  if (!selectedCategory) {
    return <p>Veuillez sélectionner une catégorie</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {articles.map((article: Article) => (
        <Card key={article.id_article} className="p-4">
          <CardContent>
            <h2
              className="text-xl font-semibold mb-2 cursor-pointer"
              onClick={() => onArticleClick(article.id_article)}
            >
              {article.titre}
            </h2>
            <p className="text-sm mb-2">{article.contenu}</p>
            <p className="text-xs text-gray-500">
              Publié le {new Date(article.creeLe).toLocaleDateString()}
            </p>

            <div className="mt-2 flex gap-2">
              <Button
                variant="destructive"
                onClick={() => onDeleteArticle(article)}
              >
                Supprimer
              </Button>
            </div>

            <EvaluationForm
              categorieId={article.categorie_id}
              articleId={article.id_article}
              onEvaluationDone={() =>
                onRefetchMoyenne(article.categorie_id, article.id_article)
              }
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArticlesList;

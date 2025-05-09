import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ReputationService } from '../../lib/services/ReputationService';
import { AIService } from '../../lib/services/AIService';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function AIReviewAnalyzer() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [analysis, setAnalysis] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const reviewsData = await ReputationService.getReviews();
        setReviews(reviewsData);
        
        // Analyze reviews
        if (reviewsData.length > 0) {
          const analysisData = await AIService.analyzeReviews(reviewsData);
          setAnalysis(analysisData);
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTimeRangeChange = async (value: string) => {
    setTimeRange(value);
    setInsightsLoading(true);
    try {
      const insightsData = await AIService.generateReviewInsights(value);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Review Analyzer</h1>
          <p className="text-muted-foreground">
            Gain deeper insights into your customer reviews with AI-powered analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
              <SelectItem value="all_time">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleTimeRangeChange(timeRange)}>
            Refresh Analysis
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sentiment">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="themes">Common Themes</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-6 mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[150px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Breakdown</CardTitle>
                    <CardDescription>Distribution of review sentiment</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-48 h-48 relative flex items-center justify-center">
                      <PieChart className="w-full h-full text-muted-foreground absolute opacity-10" />
                      <div className="text-center">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Positive: {analysis?.sentiment_breakdown?.positive || 0}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Neutral: {analysis?.sentiment_breakdown?.neutral || 0}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Negative: {analysis?.sentiment_breakdown?.negative || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Strengths</CardTitle>
                    <CardDescription>What customers love about you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis?.strengths ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No strengths identified yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>What could be better</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis?.improvement_areas ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {analysis.improvement_areas.map((area: string, index: number) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No improvement areas identified yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Based on sentiment analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis?.recommendations ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {analysis.recommendations.map((recommendation: string, index: number) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No recommendations available yet</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="themes" className="space-y-6 mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[150px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Positive Themes</CardTitle>
                  <CardDescription>Common positive topics in reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis?.common_themes?.positive && analysis.common_themes.positive.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.common_themes.positive.map((theme: string, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-full bg-muted rounded-full h-4">
                            <div
                              className="bg-green-500 h-4 rounded-full"
                              style={{ width: `${Math.min(100, (index + 1) * 20)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm whitespace-nowrap">{theme}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No positive themes identified yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Negative Themes</CardTitle>
                  <CardDescription>Common negative topics in reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis?.common_themes?.negative && analysis.common_themes.negative.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.common_themes.negative.map((theme: string, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-full bg-muted rounded-full h-4">
                            <div
                              className="bg-red-500 h-4 rounded-full"
                              style={{ width: `${Math.min(100, (index + 1) * 20)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm whitespace-nowrap">{theme}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No negative themes identified yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trend Analysis</CardTitle>
                <CardDescription>
                  {analysis?.trend_analysis?.sentiment_trend === 'improving'
                    ? 'Your sentiment is improving over time'
                    : analysis?.trend_analysis?.sentiment_trend === 'declining'
                    ? 'Your sentiment is declining over time'
                    : 'Your sentiment is stable over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full relative flex items-center justify-center">
                  <LineChart className="w-full h-full text-muted-foreground absolute opacity-10" />
                  <div className="text-center max-w-md">
                    <h3 className="text-lg font-medium mb-2">
                      {analysis?.trend_analysis?.sentiment_trend === 'improving'
                        ? '📈 Positive Trend'
                        : analysis?.trend_analysis?.sentiment_trend === 'declining'
                        ? '📉 Negative Trend'
                        : '📊 Stable Trend'}
                    </h3>
                    <p>{analysis?.trend_analysis?.description || 'No trend analysis available yet'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6 mt-6">
          {insightsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ) : insights ? (
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>
                  Based on your reviews from {timeRange.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Summary</h3>
                  <p>{insights.summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {insights.key_insights.map((insight: string, index: number) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {insights.recommendations.map((recommendation: string, index: number) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Generate AI Insights</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Select a time range and click "Generate Insights" to get AI-powered analysis of your reviews
              </p>
              <Button onClick={() => handleTimeRangeChange(timeRange)}>
                Generate Insights
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
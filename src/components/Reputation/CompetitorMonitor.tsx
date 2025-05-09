import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ReputationService } from '../../lib/services/ReputationService';
import { AIService } from '../../lib/services/AIService';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Plus, 
  RefreshCw, 
  Star, 
  Building2, 
  Globe, 
  Search,
  Trash2,
  Edit,
  ExternalLink,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export default function CompetitorMonitor() {
  const [loading, setLoading] = useState(true);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [competitorDetails, setCompetitorDetails] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [comparison, setComparison] = useState<any>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [addCompetitorOpen, setAddCompetitorOpen] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    website: '',
    platforms: {
      google: { id: '', name: '' },
      facebook: { id: '', name: '' },
      yelp: { id: '', name: '' }
    }
  });

  useEffect(() => {
    fetchCompetitors();
  }, []);

  useEffect(() => {
    if (selectedCompetitor) {
      fetchCompetitorDetails(selectedCompetitor);
    }
  }, [selectedCompetitor, timeRange]);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const data = await ReputationService.getCompetitors();
      setCompetitors(data);
      if (data.length > 0 && !selectedCompetitor) {
        setSelectedCompetitor(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompetitorDetails = async (id: string) => {
    setLoading(true);
    try {
      const details = await ReputationService.getCompetitorDetails(id, timeRange);
      setCompetitorDetails(details);
    } catch (error) {
      console.error('Error fetching competitor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const compareWithCompetitors = async () => {
    setComparisonLoading(true);
    try {
      const selectedCompetitorIds = competitors.map(c => c.id);
      const comparisonData = await ReputationService.compareWithCompetitors(selectedCompetitorIds);
      setComparison(comparisonData);
    } catch (error) {
      console.error('Error comparing with competitors:', error);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleAddCompetitor = async () => {
    try {
      // Filter out empty platform entries
      const platforms: any = {};
      Object.entries(newCompetitor.platforms).forEach(([key, value]) => {
        if (value.id && value.name) {
          platforms[key] = value;
        }
      });

      await ReputationService.addCompetitor({
        name: newCompetitor.name,
        website: newCompetitor.website,
        platforms
      });

      // Reset form and close dialog
      setNewCompetitor({
        name: '',
        website: '',
        platforms: {
          google: { id: '', name: '' },
          facebook: { id: '', name: '' },
          yelp: { id: '', name: '' }
        }
      });
      setAddCompetitorOpen(false);
      
      // Refresh competitors list
      fetchCompetitors();
    } catch (error) {
      console.error('Error adding competitor:', error);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this competitor?')) {
      try {
        await ReputationService.deleteCompetitor(id);
        
        // If the deleted competitor was selected, reset selection
        if (selectedCompetitor === id) {
          setSelectedCompetitor(null);
          setCompetitorDetails(null);
        }
        
        // Refresh competitors list
        fetchCompetitors();
      } catch (error) {
        console.error('Error deleting competitor:', error);
      }
    }
  };

  const handleSyncCompetitor = async (id: string) => {
    try {
      await ReputationService.syncCompetitor(id);
      fetchCompetitorDetails(id);
    } catch (error) {
      console.error('Error syncing competitor:', error);
    }
  };

  const getCompetitorById = (id: string) => {
    return competitors.find(c => c.id === id);
  };

  const formatRatingDifference = (yourRating: number, competitorRating: number) => {
    const diff = yourRating - competitorRating;
    if (diff > 0) {
      return <span className="text-green-600">+{diff.toFixed(1)}</span>;
    } else if (diff < 0) {
      return <span className="text-red-600">{diff.toFixed(1)}</span>;
    } else {
      return <span className="text-gray-600">0</span>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Competitor Monitor</h1>
          <p className="text-muted-foreground">
            Track and compare your online reputation against competitors
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={addCompetitorOpen} onOpenChange={setAddCompetitorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Competitor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Competitor</DialogTitle>
                <DialogDescription>
                  Enter your competitor's details to start tracking their online reputation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="website" className="text-right">
                    Website
                  </label>
                  <Input
                    id="website"
                    value={newCompetitor.website}
                    onChange={(e) => setNewCompetitor({...newCompetitor, website: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <Separator />
                <h3 className="font-medium">Review Platforms</h3>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="google-id" className="text-right">
                    Google
                  </label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Input
                      id="google-id"
                      placeholder="Place ID"
                      value={newCompetitor.platforms.google.id}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          google: {
                            ...newCompetitor.platforms.google,
                            id: e.target.value
                          }
                        }
                      })}
                    />
                    <Input
                      placeholder="Business Name"
                      value={newCompetitor.platforms.google.name}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          google: {
                            ...newCompetitor.platforms.google,
                            name: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="yelp-id" className="text-right">
                    Yelp
                  </label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Input
                      id="yelp-id"
                      placeholder="Business ID"
                      value={newCompetitor.platforms.yelp.id}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          yelp: {
                            ...newCompetitor.platforms.yelp,
                            id: e.target.value
                          }
                        }
                      })}
                    />
                    <Input
                      placeholder="Business Name"
                      value={newCompetitor.platforms.yelp.name}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          yelp: {
                            ...newCompetitor.platforms.yelp,
                            name: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="facebook-id" className="text-right">
                    Facebook
                  </label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Input
                      id="facebook-id"
                      placeholder="Page ID"
                      value={newCompetitor.platforms.facebook.id}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          facebook: {
                            ...newCompetitor.platforms.facebook,
                            id: e.target.value
                          }
                        }
                      })}
                    />
                    <Input
                      placeholder="Page Name"
                      value={newCompetitor.platforms.facebook.name}
                      onChange={(e) => setNewCompetitor({
                        ...newCompetitor, 
                        platforms: {
                          ...newCompetitor.platforms,
                          facebook: {
                            ...newCompetitor.platforms.facebook,
                            name: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCompetitor}>Add Competitor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={compareWithCompetitors} disabled={comparisonLoading || competitors.length === 0}>
            {comparisonLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <BarChart className="mr-2 h-4 w-4" />
                Compare All
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && competitors.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : competitors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Competitors Added</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start tracking your competitors by adding them to your monitor. You'll be able to compare ratings, reviews, and more.
            </p>
            <Button onClick={() => setAddCompetitorOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Competitor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Competitors</CardTitle>
                <CardDescription>Select to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {competitors.map((competitor) => (
                    <div
                      key={competitor.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                        selectedCompetitor === competitor.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedCompetitor(competitor.id)}
                    >
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{competitor.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSyncCompetitor(competitor.id);
                          }}
                          className="p-1 rounded-md hover:bg-background"
                          title="Sync competitor data"
                        >
                          <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCompetitor(competitor.id);
                          }}
                          className="p-1 rounded-md hover:bg-background"
                          title="Delete competitor"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {selectedCompetitor ? (
              loading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-[250px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="overview">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {getCompetitorById(selectedCompetitor)?.name}
                      </h2>
                      <p className="text-muted-foreground">
                        <a 
                          href={getCompetitorById(selectedCompetitor)?.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center hover:underline"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {getCompetitorById(selectedCompetitor)?.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_7_days">Last 7 days</SelectItem>
                          <SelectItem value="last_30_days">Last 30 days</SelectItem>
                          <SelectItem value="last_90_days">Last 90 days</SelectItem>
                          <SelectItem value="last_year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleSyncCompetitor(selectedCompetitor)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {competitorDetails && Object.entries(competitorDetails.platforms).map(([platform, data]: [string, any]) => (
                        <Card key={platform}>
                          <CardHeader className="pb-2">
                            <CardTitle className="capitalize">{platform}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Your Rating</p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                  <span className="text-xl font-bold">{data.your_rating.toFixed(1)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Your Reviews</p>
                                <p className="text-xl font-bold">{data.your_reviews}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Their Rating</p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                  <span className="text-xl font-bold">{data.competitor_rating.toFixed(1)}</span>
                                  <span className="ml-2 text-sm">
                                    {formatRatingDifference(data.your_rating, data.competitor_rating)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Their Reviews</p>
                                <p className="text-xl font-bold">
                                  {data.competitor_reviews}
                                  <span className="ml-2 text-sm">
                                    {data.your_reviews > data.competitor_reviews ? (
                                      <span className="text-green-600">+{data.your_reviews - data.competitor_reviews}</span>
                                    ) : data.your_reviews < data.competitor_reviews ? (
                                      <span className="text-red-600">-{data.competitor_reviews - data.your_reviews}</span>
                                    ) : (
                                      <span className="text-gray-600">0</span>
                                    )}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Review Volume Over Time</CardTitle>
                        <CardDescription>
                          Comparing your review volume with {getCompetitorById(selectedCompetitor)?.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full relative flex items-center justify-center">
                          <LineChart className="w-full h-full text-muted-foreground absolute opacity-10" />
                          {competitorDetails?.review_volume && competitorDetails.review_volume.length > 0 ? (
                            <div className="text-center">
                              <p>Chart would display review volume over time</p>
                              <p className="text-muted-foreground">Data available for visualization</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p>No review volume data available</p>
                              <p className="text-muted-foreground">Try syncing competitor data or changing the time range</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6 mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Recent Competitor Reviews</CardTitle>
                          <div className="flex items-center gap-2">
                            <Input 
                              placeholder="Search reviews..." 
                              className="w-[200px]"
                              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
                            />
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Platforms</SelectItem>
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="yelp">Yelp</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {competitorDetails?.recent_reviews && competitorDetails.recent_reviews.length > 0 ? (
                          <div className="space-y-4">
                            {competitorDetails.recent_reviews.map((review: any, index: number) => (
                              <div key={index} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-medium">{review.author_name}</p>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        {new Date(review.created_at).toLocaleDateString()}
                                      </span>
                                      <span className="ml-2 px-2 py-1 rounded-full text-xs bg-muted">
                                        {review.platform}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm">{review.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">No reviews available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comparison" className="space-y-6 mt-6">
                    {comparisonLoading ? (
                      <Card>
                        <CardHeader>
                          <Skeleton className="h-6 w-[250px]" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                      </Card>
                    ) : comparison ? (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle>Overall Comparison</CardTitle>
                            <CardDescription>
                              How you compare to {getCompetitorById(selectedCompetitor)?.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-medium mb-4">Rating Comparison</h3>
                                <div className="flex items-center justify-between mb-2">
                                  <span>Your Average Rating</span>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="font-medium">{comparison.overall_comparison.your_rating.toFixed(1)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Competitor Average Rating</span>
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="font-medium">{comparison.overall_comparison.competitor_avg_rating.toFixed(1)}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium mb-4">Review Volume</h3>
                                <div className="flex items-center justify-between mb-2">
                                  <span>Your Total Reviews</span>
                                  <span className="font-medium">{comparison.overall_comparison.your_review_count}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Competitor Average Reviews</span>
                                  <span className="font-medium">{comparison.overall_comparison.competitor_avg_review_count}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Platform Comparison</CardTitle>
                            <CardDescription>
                              Breakdown by review platform
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              {Object.entries(comparison.platform_comparison).map(([platform, data]: [string, any]) => (
                                <div key={platform}>
                                  <h3 className="text-lg font-medium capitalize mb-4">{platform}</h3>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span>Your Rating</span>
                                        <div className="flex items-center">
                                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                          <span className="font-medium">{data.your_rating.toFixed(1)}</span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        {Object.entries(data.competitor_ratings).map(([compName, rating]: [string, any]) => (
                                          <div key={compName} className="flex items-center justify-between">
                                            <span>{compName}</span>
                                            <div className="flex items-center">
                                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                              <span className="font-medium">{Number(rating).toFixed(1)}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span>Your Reviews</span>
                                        <span className="font-medium">{data.your_review_count}</span>
                                      </div>
                                      <div className="space-y-2">
                                        {Object.entries(data.competitor_review_counts).map(([compName, count]: [string, any]) => (
                                          <div key={compName} className="flex items-center justify-between">
                                            <span>{compName}</span>
                                            <span className="font-medium">{count}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  {platform !== Object.keys(comparison.platform_comparison).slice(-1)[0] && (
                                    <Separator className="my-4" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>AI Insights</CardTitle>
                            <CardDescription>
                              AI-generated competitive analysis
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-medium mb-2">Strengths Compared to Competitors</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {comparison.comparison?.strengths.map((strength: string, index: number) => (
                                    <li key={index}>{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <h3 className="text-lg font-medium mb-2">Weaknesses Compared to Competitors</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {comparison.comparison?.weaknesses.map((weakness: string, index: number) => (
                                    <li key={index}>{weakness}</li>
                                  ))}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <h3 className="text-lg font-medium mb-2">Opportunities</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {comparison.comparison?.opportunities.map((opportunity: string, index: number) => (
                                    <li key={index}>{opportunity}</li>
                                  ))}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {comparison.recommendations?.map((recommendation: string, index: number) => (
                                    <li key={index}>{recommendation}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center p-12">
                          <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">Generate Comparison</h3>
                          <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Click the button below to generate a detailed comparison between your business and your competitors.
                          </p>
                          <Button onClick={compareWithCompetitors}>
                            <BarChart className="mr-2 h-4 w-4" />
                            Compare with Competitors
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              )
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Select a Competitor</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Choose a competitor from the list to view detailed information and comparison.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
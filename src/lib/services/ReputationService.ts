// This is a mock service for reputation management functionality
// In a real application, this would connect to a backend API

export const ReputationService = {
  /**
   * Gets a list of reviews
   */
  getReviews: async (options?: { 
    dateRange?: { start: Date; end: Date }; 
    platform?: string;
    rating?: number;
    search?: string;
  }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock reviews data
    const reviews = [
      {
        id: '1',
        platform: 'google',
        author_name: 'John Smith',
        rating: 5,
        content: 'Excellent service! The team was professional, on time, and did a fantastic job on our roof. Would highly recommend to anyone looking for quality roofing work.',
        created_at: '2023-10-15T14:23:00Z',
        replied: true,
        reply: {
          content: "Thank you for your kind words, John! We're glad to hear you were satisfied with our service. We appreciate your business and recommendation!",
          created_at: '2023-10-16T09:15:00Z'
        }
      },
      {
        id: '2',
        platform: 'yelp',
        author_name: 'Sarah Johnson',
        rating: 4,
        content: 'Good experience overall. The work was done well and the price was fair. Only giving 4 stars because there was some delay in scheduling, but they communicated well about it.',
        created_at: '2023-10-10T11:45:00Z',
        replied: true,
        reply: {
          content: "Thank you for your feedback, Sarah. We appreciate your understanding regarding the scheduling delay. We're constantly working to improve our scheduling process. Thank you for choosing our services!",
          created_at: '2023-10-11T08:30:00Z'
        }
      },
      {
        id: '3',
        platform: 'facebook',
        author_name: 'Michael Brown',
        rating: 2,
        content: 'Disappointed with the service. The job took longer than promised and there was a mess left behind. The actual roof work seems fine but the experience was frustrating.',
        created_at: '2023-10-05T16:20:00Z',
        replied: true,
        reply: {
          content: "We're sorry to hear about your experience, Michael. We strive to provide excellent service and clearly fell short in this case. We'd like to make this right - our manager will be contacting you directly to address your concerns about the cleanup and timeline issues.",
          created_at: '2023-10-06T09:10:00Z'
        }
      },
      {
        id: '4',
        platform: 'google',
        author_name: 'Emily Wilson',
        rating: 5,
        content: 'Fantastic experience from start to finish! The estimate was fair, the team was professional and skilled, and they completed the job ahead of schedule. Our new roof looks amazing!',
        created_at: '2023-09-28T13:15:00Z',
        replied: false,
        reply: null
      },
      {
        id: '5',
        platform: 'yelp',
        author_name: 'David Martinez',
        rating: 3,
        content: 'Average service. The roof looks good but communication could have been better throughout the process. Had to call multiple times to get updates on the project timeline.',
        created_at: '2023-09-22T10:30:00Z',
        replied: false,
        reply: null
      }
    ];
    
    // Apply filters if provided
    let filteredReviews = [...reviews];
    
    if (options?.dateRange) {
      const { start, end } = options.dateRange;
      filteredReviews = filteredReviews.filter(review => {
        const reviewDate = new Date(review.created_at);
        return reviewDate >= start && reviewDate <= end;
      });
    }
    
    if (options?.platform) {
      filteredReviews = filteredReviews.filter(review => 
        review.platform.toLowerCase() === options.platform?.toLowerCase()
      );
    }
    
    if (options?.rating) {
      filteredReviews = filteredReviews.filter(review => 
        review.rating === options.rating
      );
    }
    
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredReviews = filteredReviews.filter(review => 
        review.content.toLowerCase().includes(searchTerm) || 
        review.author_name.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredReviews;
  },
  
  /**
   * Gets a list of competitors
   */
  getCompetitors: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock competitors data
    return [
      {
        id: 'comp1',
        name: 'Elite Roofing Solutions',
        website: 'https://eliteroofingsolutions.com',
        platforms: {
          google: { id: 'g-12345', name: 'Elite Roofing Solutions' },
          yelp: { id: 'y-12345', name: 'Elite Roofing Solutions' },
          facebook: { id: 'f-12345', name: 'Elite Roofing Solutions' }
        }
      },
      {
        id: 'comp2',
        name: 'Premium Roof Masters',
        website: 'https://premiumroofmasters.com',
        platforms: {
          google: { id: 'g-23456', name: 'Premium Roof Masters' },
          yelp: { id: 'y-23456', name: 'Premium Roof Masters' }
        }
      },
      {
        id: 'comp3',
        name: 'Apex Roofing & Construction',
        website: 'https://apexroofingconstruction.com',
        platforms: {
          google: { id: 'g-34567', name: 'Apex Roofing & Construction' },
          facebook: { id: 'f-34567', name: 'Apex Roofing & Construction' }
        }
      }
    ];
  },
  
  /**
   * Gets details for a specific competitor
   */
  getCompetitorDetails: async (id: string, timeRange: string = 'last_30_days') => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock competitor details
    return {
      platforms: {
        google: {
          your_rating: 4.7,
          your_reviews: 156,
          competitor_rating: id === 'comp1' ? 4.5 : id === 'comp2' ? 4.8 : 4.3,
          competitor_reviews: id === 'comp1' ? 132 : id === 'comp2' ? 98 : 187
        },
        yelp: {
          your_rating: 4.4,
          your_reviews: 87,
          competitor_rating: id === 'comp1' ? 4.2 : id === 'comp2' ? 4.6 : 4.0,
          competitor_reviews: id === 'comp1' ? 65 : id === 'comp2' ? 112 : 54
        },
        facebook: {
          your_rating: 4.8,
          your_reviews: 92,
          competitor_rating: id === 'comp1' ? 4.6 : id === 'comp2' ? 4.3 : 4.7,
          competitor_reviews: id === 'comp1' ? 78 : id === 'comp2' ? 45 : 103
        }
      },
      review_volume: [
        { date: '2023-09-01', your_count: 12, competitor_count: 8 },
        { date: '2023-09-08', your_count: 15, competitor_count: 10 },
        { date: '2023-09-15', your_count: 9, competitor_count: 12 },
        { date: '2023-09-22', your_count: 14, competitor_count: 9 },
        { date: '2023-09-29', your_count: 11, competitor_count: 7 },
        { date: '2023-10-06', your_count: 16, competitor_count: 11 },
        { date: '2023-10-13', your_count: 13, competitor_count: 14 },
        { date: '2023-10-20', your_count: 18, competitor_count: 10 }
      ],
      recent_reviews: [
        {
          id: `${id}-rev1`,
          platform: 'google',
          author_name: 'Alex Thompson',
          rating: 4,
          content: "Good service overall. The team was professional and completed the job on time. The only reason I'm not giving 5 stars is because there was some miscommunication about the materials being used.",
          created_at: '2023-10-18T15:30:00Z'
        },
        {
          id: `${id}-rev2`,
          platform: 'yelp',
          author_name: 'Jessica Miller',
          rating: 5,
          content: 'Excellent experience! They were prompt, professional, and did a fantastic job on our roof. The price was competitive and they cleaned up thoroughly after the job was done.',
          created_at: '2023-10-15T11:45:00Z'
        },
        {
          id: `${id}-rev3`,
          platform: 'facebook',
          author_name: 'Robert Garcia',
          rating: 3,
          content: 'Average service. The work was done adequately but there were delays in starting the project and communication could have been better throughout the process.',
          created_at: '2023-10-10T09:20:00Z'
        },
        {
          id: `${id}-rev4`,
          platform: 'google',
          author_name: 'Michelle Lee',
          rating: 5,
          content: 'Fantastic job on our roof replacement! The crew was efficient, skilled, and very respectful of our property. They cleaned up perfectly after finishing the job. Highly recommend!',
          created_at: '2023-10-05T14:15:00Z'
        },
        {
          id: `${id}-rev5`,
          platform: 'yelp',
          author_name: 'Daniel Wilson',
          rating: 2,
          content: 'Disappointed with the service. The quality of work seems fine, but they were late every day, left a mess, and were not responsive to my concerns during the project.',
          created_at: '2023-10-01T16:40:00Z'
        }
      ]
    };
  },
  
  /**
   * Adds a new competitor
   */
  addCompetitor: async (competitor: {
    name: string;
    website: string;
    platforms: {
      [key: string]: { id: string; name: string };
    };
  }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random ID for the new competitor
    const id = `comp${Math.floor(Math.random() * 10000)}`;
    
    // Return the new competitor with the generated ID
    return {
      id,
      ...competitor
    };
  },
  
  /**
   * Deletes a competitor
   */
  deleteCompetitor: async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success
    return { success: true };
  },
  
  /**
   * Syncs competitor data from review platforms
   */
  syncCompetitor: async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return success
    return { success: true };
  },
  
  /**
   * Compares your business with competitors
   */
  compareWithCompetitors: async (competitorIds: string[]) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Mock comparison data
    return {
      overall_comparison: {
        your_rating: 4.6,
        your_review_count: 335,
        competitor_avg_rating: 4.4,
        competitor_avg_review_count: 289
      },
      platform_comparison: {
        google: {
          your_rating: 4.7,
          your_review_count: 156,
          competitor_ratings: {
            'Elite Roofing Solutions': 4.5,
            'Premium Roof Masters': 4.8,
            'Apex Roofing & Construction': 4.3
          },
          competitor_review_counts: {
            'Elite Roofing Solutions': 132,
            'Premium Roof Masters': 98,
            'Apex Roofing & Construction': 187
          }
        },
        yelp: {
          your_rating: 4.4,
          your_review_count: 87,
          competitor_ratings: {
            'Elite Roofing Solutions': 4.2,
            'Premium Roof Masters': 4.6,
            'Apex Roofing & Construction': 4.0
          },
          competitor_review_counts: {
            'Elite Roofing Solutions': 65,
            'Premium Roof Masters': 112,
            'Apex Roofing & Construction': 54
          }
        },
        facebook: {
          your_rating: 4.8,
          your_review_count: 92,
          competitor_ratings: {
            'Elite Roofing Solutions': 4.6,
            'Premium Roof Masters': 4.3,
            'Apex Roofing & Construction': 4.7
          },
          competitor_review_counts: {
            'Elite Roofing Solutions': 78,
            'Premium Roof Masters': 45,
            'Apex Roofing & Construction': 103
          }
        }
      },
      comparison: {
        strengths: [
          "Higher average rating on Google (4.8 vs competitors' average of 4.3)",
          "More consistent quality mentioned across reviews",
          "Better response to negative reviews",
          "More detailed quotes and estimates",
          "Faster project completion times"
        ],
        weaknesses: [
          "Lower review volume on Yelp compared to top competitors",
          "Fewer mentions of competitive pricing",
          "Less social media engagement",
          "Fewer reviews mentioning innovative solutions",
          "Less emphasis on eco-friendly practices"
        ],
        opportunities: [
          "Increase review volume on Yelp to match competitors",
          "Highlight eco-friendly practices in marketing materials",
          "Implement innovative solutions that competitors aren't offering",
          "Engage more actively on social media platforms",
          "Consider competitive pricing strategies for certain services"
        ]
      },
      recommendations: [
        "Launch a campaign to encourage satisfied customers to leave Yelp reviews",
        "Develop and promote eco-friendly service options",
        "Showcase innovative solutions in case studies on your website",
        "Implement a social media content calendar to increase engagement",
        "Review pricing structure for services where competitors have an advantage"
      ]
    };
  }
};
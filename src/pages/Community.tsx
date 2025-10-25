import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Flag, Trash2, Calendar, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  location: string | null;
  created_at: string;
  profiles?: { name: string; city: string; university: string | null };
}

interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  image_url: string | null;
  created_at: string;
  profiles?: { name: string; city: string; university: string | null };
}

const Community = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [newPost, setNewPost] = useState('');
  const [newPostLocation, setNewPostLocation] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    event_date: ''
  });
  const [filter, setFilter] = useState<'all' | 'myCity' | 'myUniversity'>('all');
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadPosts();
      loadEvents();
      loadUserProfile();
    }
  }, [user, filter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setUserProfile(data);
  };

  const loadPosts = async () => {
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!postsData) {
      setPosts([]);
      return;
    }

    // Get profiles for all posts
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, name, city, university')
      .in('user_id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

    const postsWithProfiles = postsData.map(post => ({
      ...post,
      profiles: profilesMap.get(post.user_id) || { name: 'Anonymous', city: '', university: null }
    }));

    // Apply filters
    let filteredPosts = postsWithProfiles;
    if (filter === 'myCity' && userProfile?.city) {
      filteredPosts = postsWithProfiles.filter(p => p.profiles?.city === userProfile.city);
    } else if (filter === 'myUniversity' && userProfile?.university) {
      filteredPosts = postsWithProfiles.filter(p => p.profiles?.university === userProfile.university);
    }

    setPosts(filteredPosts);

    // Load likes and comments counts
    if (filteredPosts.length > 0) {
      const postIds = filteredPosts.map(p => p.id);
      
      // Load likes
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .in('post_id', postIds);
      
      const counts: Record<string, number> = {};
      likes?.forEach(like => {
        counts[like.post_id] = (counts[like.post_id] || 0) + 1;
      });
      setLikesCount(counts);

      // Load user's likes
      if (user) {
        const { data: userLikesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        setUserLikes(new Set(userLikesData?.map(l => l.post_id) || []));
      }

      // Load comments
      const { data: comments } = await supabase
        .from('post_comments')
        .select('post_id')
        .in('post_id', postIds);
      
      const commentCounts: Record<string, number> = {};
      comments?.forEach(comment => {
        commentCounts[comment.post_id] = (commentCounts[comment.post_id] || 0) + 1;
      });
      setCommentsCount(commentCounts);
    }
  };

  const loadEvents = async () => {
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (!eventsData) {
      setEvents([]);
      return;
    }

    // Get profiles for all events
    const userIds = [...new Set(eventsData.map(e => e.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, name, city, university')
      .in('user_id', userIds);

    const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

    let eventsWithProfiles = eventsData.map(event => ({
      ...event,
      profiles: profilesMap.get(event.user_id) || { name: 'Anonymous', city: '', university: null }
    }));

    // Apply filters
    if (filter === 'myCity' && userProfile?.city) {
      eventsWithProfiles = eventsWithProfiles.filter(e => 
        e.location.toLowerCase().includes(userProfile.city.toLowerCase())
      );
    }

    setEvents(eventsWithProfiles);
  };

  const createPost = async () => {
    if (!user || !newPost.trim()) return;

    const { error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        content: newPost.trim(),
        location: newPostLocation.trim() || null
      });

    if (error) {
      toast.error('Failed to create post');
      return;
    }

    toast.success('Post created!');
    setNewPost('');
    setNewPostLocation('');
    loadPosts();
  };

  const createEvent = async () => {
    if (!user || !newEvent.title.trim() || !newEvent.location.trim() || !newEvent.event_date) return;

    const { error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        title: newEvent.title.trim(),
        description: newEvent.description.trim() || null,
        location: newEvent.location.trim(),
        event_date: newEvent.event_date
      });

    if (error) {
      toast.error('Failed to create event');
      return;
    }

    toast.success('Event created!');
    setNewEvent({ title: '', description: '', location: '', event_date: '' });
    loadEvents();
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const isLiked = userLikes.has(postId);

    if (isLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      userLikes.delete(postId);
      setLikesCount(prev => ({ ...prev, [postId]: (prev[postId] || 1) - 1 }));
    } else {
      await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });
      
      userLikes.add(postId);
      setLikesCount(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }

    setUserLikes(new Set(userLikes));
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast.error('Failed to delete post');
      return;
    }

    toast.success('Post deleted');
    loadPosts();
  };

  const reportContent = async (contentType: string, contentId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('content_reports')
      .insert({
        reporter_id: user.id,
        content_type: contentType,
        content_id: contentId,
        reason: 'User reported content'
      });

    if (error) {
      toast.error('Failed to report');
      return;
    }

    toast.success('Content reported. Thank you for keeping our community safe.');
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('community.title')}</h2>
        <p className="text-muted-foreground mb-4">{t('community.loginRequired')}</p>
        <Button onClick={() => navigate('/auth')}>{t('community.signIn')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 flex items-center justify-center gap-2 text-foreground">
          <MessageSquare className="h-8 w-8 text-accent" />
          {t('community.title')}
        </h1>
        <p className="text-muted-foreground">{t('community.subtitle')}</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap justify-center">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('community.filter.all')}
        </Button>
        <Button
          variant={filter === 'myCity' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('myCity')}
        >
          {t('community.filter.myCity')}
        </Button>
        <Button
          variant={filter === 'myUniversity' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('myUniversity')}
        >
          {t('community.filter.myUniversity')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">{t('community.tabs.posts')}</TabsTrigger>
          <TabsTrigger value="events">{t('community.tabs.events')}</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          {/* Create Post */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Textarea
                placeholder={t('community.post.content')}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <Input
                placeholder={t('community.post.location')}
                value={newPostLocation}
                onChange={(e) => setNewPostLocation(e.target.value)}
              />
              <Button onClick={createPost} className="w-full">
                {t('community.post.submit')}
              </Button>
            </CardContent>
          </Card>

          {/* Posts List */}
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{post.profiles?.name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.profiles?.city} {post.profiles?.university && `• ${post.profiles.university}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => reportContent('post', post.id)}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                    {post.user_id === user.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{post.content}</p>
                {post.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {post.location}
                  </p>
                )}
                <div className="flex gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={userLikes.has(post.id) ? 'text-accent' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${userLikes.has(post.id) ? 'fill-current' : ''}`} />
                    {likesCount[post.id] || 0} {t('community.post.likes')}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {commentsCount[post.id] || 0} {t('community.post.comments')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {/* Create Event */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Input
                placeholder={t('community.event.title')}
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder={t('community.event.description')}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={2}
              />
              <Input
                placeholder={t('community.event.location')}
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <Input
                type="datetime-local"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
              />
              <Button onClick={createEvent} className="w-full">
                {t('community.event.submit')}
              </Button>
            </CardContent>
          </Card>

          {/* Events List */}
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {event.profiles?.name || 'Anonymous'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => reportContent('event', event.id)}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.description && <p className="text-muted-foreground">{event.description}</p>}
                <p className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleString()}
                </p>
                <p className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  {t('community.event.interested')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
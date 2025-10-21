import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Copy, ClipboardCheck, DollarSign, StickyNote, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function RoommateHub() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<any>(null);
  const [currentHub, setCurrentHub] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [hubName, setHubName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', frequency: 'once', assigned_to: '' });
  const [newBill, setNewBill] = useState({ title: '', total_amount: '', due_date: '' });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadHub();
  }, []);

  const loadHub = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user || null);
      if (!user) return;

      // Get user's hub membership
      const { data: membership } = await supabase
        .from('hub_members')
        .select('hub_id')
        .eq('user_id', user.id)
        .single();

      if (membership) {
        // Load hub details
        const { data: hub } = await supabase
          .from('roommate_hubs')
          .select('*')
          .eq('id', membership.hub_id)
          .single();

        setCurrentHub(hub);
        
        // Load members
        const { data: hubMembers } = await supabase
          .from('hub_members')
          .select('*')
          .eq('hub_id', membership.hub_id);
        
        // Load profiles separately
        if (hubMembers) {
          const memberIds = hubMembers.map(m => m.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, name, email')
            .in('user_id', memberIds);
          
          const membersWithProfiles = hubMembers.map(member => ({
            ...member,
            profiles: profilesData?.find(p => p.user_id === member.user_id)
          }));
          setMembers(membersWithProfiles);
        } else {
          setMembers([]);
        }

        // Load tasks
        const { data: hubTasks } = await supabase
          .from('hub_tasks')
          .select('*')
          .eq('hub_id', membership.hub_id)
          .order('created_at', { ascending: false });
        
        // Load assignee profiles
        if (hubTasks) {
          const assignedIds = hubTasks.filter(t => t.assigned_to).map(t => t.assigned_to);
          if (assignedIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('user_id, name')
              .in('user_id', assignedIds);
            
            const tasksWithProfiles = hubTasks.map(task => ({
              ...task,
              profiles: task.assigned_to ? profilesData?.find(p => p.user_id === task.assigned_to) : null
            }));
            setTasks(tasksWithProfiles);
          } else {
            setTasks(hubTasks);
          }
        } else {
          setTasks([]);
        }

        // Load bills
        const { data: hubBills } = await supabase
          .from('hub_bills')
          .select('*')
          .eq('hub_id', membership.hub_id)
          .order('created_at', { ascending: false });
        setBills(hubBills || []);

        // Load notes
        const { data: hubNotes } = await supabase
          .from('hub_notes')
          .select('*')
          .eq('hub_id', membership.hub_id)
          .order('created_at', { ascending: false });
        
        // Load creator profiles
        if (hubNotes) {
          const creatorIds = hubNotes.map(n => n.created_by);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, name')
            .in('user_id', creatorIds);
          
          const notesWithProfiles = hubNotes.map(note => ({
            ...note,
            profiles: profilesData?.find(p => p.user_id === note.created_by)
          }));
          setNotes(notesWithProfiles);
        } else {
          setNotes([]);
        }
      }
    } catch (error) {
      console.error('Error loading hub:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHub = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: t('common.error'), description: 'Please log in first', variant: 'destructive' });
        return;
      }
      
      if (!hubName.trim()) {
        toast({ title: t('common.error'), description: 'Please enter a hub name', variant: 'destructive' });
        return;
      }

      // Generate invite code
      const { data: codeData, error: codeError } = await supabase.rpc('generate_invite_code');
      if (codeError) {
        console.error('Error generating invite code:', codeError);
        throw new Error('Failed to generate invite code');
      }
      const code = codeData as string;

      // Create hub
      const { data: hub, error: hubError } = await supabase
        .from('roommate_hubs')
        .insert({
          name: hubName,
          invite_code: code,
          created_by: user.id
        })
        .select()
        .single();

      if (hubError) {
        console.error('Error creating hub:', hubError);
        throw hubError;
      }

      // Add creator as member
      const { error: memberError } = await supabase.from('hub_members').insert({
        hub_id: hub.id,
        user_id: user.id
      });

      if (memberError) {
        console.error('Error adding member:', memberError);
        throw memberError;
      }

      toast({ title: t('roommate.hubCreated'), description: t('roommate.inviteOthers') });
      loadHub();
      setHubName('');
    } catch (error: any) {
      console.error('Error creating hub:', error);
      toast({ 
        title: t('common.error'), 
        description: error?.message || 'Failed to create hub',
        variant: 'destructive' 
      });
    }
  };

  const joinHub = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !inviteCode.trim()) return;

      // Use security definer function to join by code
      const { data: hubId, error } = await supabase.rpc('join_hub_by_code', { 
        _invite_code: inviteCode.trim() 
      });

      if (error) {
        if (error.message.includes('invalid_invite_code')) {
          toast({ title: t('roommate.invalidCode'), variant: 'destructive' });
        } else {
          toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        }
        return;
      }

      toast({ title: t('roommate.joinedHub') });
      loadHub();
      setInviteCode('');
    } catch (error: any) {
      console.error('Error joining hub:', error);
      toast({ title: t('common.error'), description: error?.message, variant: 'destructive' });
    }
  };

  const addTask = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !newTask.title.trim() || !currentHub) return;

      await supabase.from('hub_tasks').insert({
        hub_id: currentHub.id,
        title: newTask.title,
        description: newTask.description,
        frequency: newTask.frequency,
        assigned_to: newTask.assigned_to || null,
        created_by: user.id
      });

      toast({ title: t('roommate.taskAdded') });
      loadHub();
      setNewTask({ title: '', description: '', frequency: 'once', assigned_to: '' });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await supabase
        .from('hub_tasks')
        .update({ completed: !completed })
        .eq('id', taskId);
      loadHub();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const addBill = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !newBill.title.trim() || !newBill.total_amount || !currentHub) return;

      await supabase.from('hub_bills').insert({
        hub_id: currentHub.id,
        title: newBill.title,
        total_amount: parseFloat(newBill.total_amount),
        due_date: newBill.due_date || null,
        created_by: user.id
      });

      toast({ title: t('roommate.billAdded') });
      loadHub();
      setNewBill({ title: '', total_amount: '', due_date: '' });
    } catch (error) {
      console.error('Error adding bill:', error);
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const addNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !newNote.trim() || !currentHub) return;

      await supabase.from('hub_notes').insert({
        hub_id: currentHub.id,
        content: newNote,
        created_by: user.id
      });

      toast({ title: t('roommate.noteAdded') });
      loadHub();
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const copyInviteCode = () => {
    if (currentHub?.invite_code) {
      navigator.clipboard.writeText(currentHub.invite_code);
      toast({ title: t('roommate.codeCopied') });
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  // Require authentication first to satisfy security policies
  if (!authUser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Users className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">{t('roommate.title')}</h1>
          <p className="text-muted-foreground">Sign in to create or join a hub.</p>
        </div>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>You need an account to use RoomMate Hub.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/auth')}>Go to Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentHub) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Users className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">{t('roommate.title')}</h1>
          <p className="text-muted-foreground">{t('roommate.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('roommate.createHub')}</CardTitle>
              <CardDescription>{t('roommate.createDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder={t('roommate.hubNamePlaceholder')}
                value={hubName}
                onChange={(e) => setHubName(e.target.value)}
              />
              <Button onClick={createHub} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('roommate.create')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('roommate.joinHub')}</CardTitle>
              <CardDescription>{t('roommate.joinDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder={t('roommate.inviteCodePlaceholder')}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="uppercase"
              />
              <Button onClick={joinHub} variant="secondary" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                {t('roommate.join')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">{currentHub.name}</h1>
          <p className="text-sm text-muted-foreground">{members.length} {t('roommate.members')}</p>
        </div>
        <Button variant="outline" onClick={copyInviteCode}>
          <Copy className="h-4 w-4 mr-2" />
          {currentHub.invite_code}
        </Button>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {t('roommate.tasks')}
          </TabsTrigger>
          <TabsTrigger value="bills">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('roommate.bills')}
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="h-4 w-4 mr-2" />
            {t('roommate.notes')}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            {t('roommate.members')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('roommate.addTask')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('roommate.newTask')}</DialogTitle>
                <DialogDescription>{t('roommate.taskDescription')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('roommate.taskTitle')}</Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('roommate.taskDetails')}</Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('roommate.frequency')}</Label>
                  <Select value={newTask.frequency} onValueChange={(v) => setNewTask({ ...newTask, frequency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">{t('roommate.once')}</SelectItem>
                      <SelectItem value="daily">{t('roommate.daily')}</SelectItem>
                      <SelectItem value="weekly">{t('roommate.weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('roommate.monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('roommate.assignTo')}</Label>
                  <Select value={newTask.assigned_to} onValueChange={(v) => setNewTask({ ...newTask, assigned_to: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('roommate.unassigned')} />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.profiles?.name || member.profiles?.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTask} className="w-full">{t('roommate.add')}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id, task.completed)}
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{t(`roommate.${task.frequency}`)}</span>
                      {task.profiles?.name && <span>→ {task.profiles.name}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('roommate.addBill')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('roommate.newBill')}</DialogTitle>
                <DialogDescription>{t('roommate.billDescription')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('roommate.billTitle')}</Label>
                  <Input
                    value={newBill.title}
                    onChange={(e) => setNewBill({ ...newBill, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('roommate.totalAmount')}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newBill.total_amount}
                    onChange={(e) => setNewBill({ ...newBill, total_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t('roommate.dueDate')}</Label>
                  <Input
                    type="date"
                    value={newBill.due_date}
                    onChange={(e) => setNewBill({ ...newBill, due_date: e.target.value })}
                  />
                </div>
                <Button onClick={addBill} className="w-full">{t('roommate.add')}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="space-y-2">
            {bills.map((bill) => (
              <Card key={bill.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{bill.title}</h3>
                      {bill.due_date && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(bill.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">€{bill.total_amount}</p>
                      <p className="text-sm text-muted-foreground">
                        €{(bill.total_amount / members.length).toFixed(2)} {t('roommate.perPerson')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder={t('roommate.notePlaceholder')}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button onClick={addNote} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('roommate.addNote')}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-6">
                  <p className="text-sm">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {note.profiles?.name} • {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-2">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{member.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Instagram, Youtube, Globe, Trash2, Edit, Calendar, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Collaboration {
  id: string;
  brand_name: string;
  platform: string;
  deliverable: string;
  posting_date: string;
  amount: number;
  payment_status: string;
  payment_due_date: string;
  onboarding_received: boolean;
  notes: string;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
  if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
  if (p.includes('tiktok')) return <span className="font-bold text-xs">TT</span>;
  return <Globe className="w-4 h-4" />;
};

const statusStyles: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Paid: 'bg-green-500/10 text-green-600 border-green-500/20',
  Delayed: 'bg-red-500/10 text-red-600 border-red-500/20',
};

// --- MOBILE CARD COMPONENT ---
const MobileCollabCard = ({ collab, onEdit, onDelete }: { collab: Collaboration, onEdit: any, onDelete: any }) => (
  <div className="bg-card border rounded-xl p-4 mb-3 shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
            <PlatformIcon platform={collab.platform} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">{collab.brand_name}</h3>
          <p className="text-xs text-muted-foreground">{collab.deliverable}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(collab)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(collab.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center gap-2 text-muted-foreground bg-secondary/20 p-2 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">{collab.posting_date || 'No Date'}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-foreground bg-secondary/20 p-2 rounded-lg">
            <DollarSign className="w-3.5 h-3.5" />
            <span>₹{collab.amount?.toLocaleString()}</span>
        </div>
    </div>

    <div className="flex justify-between items-center pt-2 border-t">
      <span className="text-xs text-muted-foreground">Status</span>
      <Badge variant="outline" className={cn('capitalize text-xs font-medium', statusStyles[collab.payment_status])}>
        {collab.payment_status}
      </Badge>
    </div>
  </div>
);

export const CollabTable = ({ data, onEdit }: { data: any[], onEdit: (collab: any) => void }) => {

  const deleteCollab = async (id: string) => {
    if(!confirm("Are you sure you want to delete this?")) return;
    const { error } = await supabase.from('collaborations').delete().eq('id', id);
    if (!error) window.location.reload(); 
  };

  if (data.length === 0) {
      return <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card/50">No collaborations match your search.</div>;
  }

  return (
    <>
      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="md:hidden space-y-3 pb-20">
        {data.map((collab) => (
            <MobileCollabCard key={collab.id} collab={collab} onEdit={onEdit} onDelete={deleteCollab} />
        ))}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block glass-card rounded-xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-secondary/30">
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Platform</TableHead>
                <TableHead className="font-semibold">Deliverable</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Due</TableHead>
                <TableHead className="font-semibold text-center">Onboarded</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((collab: Collaboration) => (
                  <TableRow key={collab.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">{collab.brand_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <PlatformIcon platform={collab.platform} />
                        <span className="text-sm hidden lg:inline">{collab.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate" title={collab.deliverable}>{collab.deliverable}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{collab.posting_date || '-'}</TableCell>
                    <TableCell className="font-semibold">₹{collab.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('capitalize text-xs font-normal', statusStyles[collab.payment_status])}>
                        {collab.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{collab.payment_due_date || '-'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={collab.onboarding_received ? 'default' : 'secondary'} className="text-[10px] h-5 px-2">
                        {collab.onboarding_received ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(collab)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteCollab(collab.id)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
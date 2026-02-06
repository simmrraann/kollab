import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Instagram, Youtube, Globe, Trash2, Edit } from 'lucide-react';
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

// ⚡️ UPDATED PROPS: Now accepts 'data' directly!
export const CollabTable = ({ data, onEdit, keyProp }: { data: any[], onEdit: (collab: any) => void, keyProp: number }) => {

  const deleteCollab = async (id: string) => {
    if(!confirm("Are you sure you want to delete this?")) return;
    const { error } = await supabase.from('collaborations').delete().eq('id', id);
    if (!error) {
       // Simple page reload to refresh list after delete (simplest fix for now)
       window.location.reload(); 
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden min-h-[400px]">
      
      {/* Note: Search bar is removed from here because it's now in the Main Header! */}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-secondary/30">
              <TableHead className="font-semibold">Brand</TableHead>
              <TableHead className="font-semibold">Platform</TableHead>
              <TableHead className="font-semibold">Deliverable</TableHead>
              <TableHead className="font-semibold">Posting Date</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment Due</TableHead>
              <TableHead className="font-semibold text-center">Onboarding</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center h-24 text-muted-foreground">No collaborations match your search.</TableCell></TableRow>
            ) : (
                data.map((collab: Collaboration) => (
              <TableRow key={collab.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-foreground">{collab.brand_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PlatformIcon platform={collab.platform} />
                    <span className="text-sm">{collab.platform}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{collab.deliverable}</TableCell>
                <TableCell className="text-sm">{collab.posting_date || '-'}</TableCell>
                <TableCell className="font-semibold">₹{collab.amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('capitalize text-xs font-normal', statusStyles[collab.payment_status])}>
                    {collab.payment_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{collab.payment_due_date || '-'}</TableCell>
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
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => onEdit(collab)} className="cursor-pointer font-medium">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteCollab(collab.id)} className="text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
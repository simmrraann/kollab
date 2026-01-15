import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Search, Filter, MoreHorizontal, Instagram, Youtube, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Collaboration {
  id: string;
  brand: string;
  platform: 'instagram' | 'youtube' | 'other';
  deliverable: string;
  recordingDate: string;
  postingDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'delayed';
  paymentDueDate: string;
  onboardingReceived: boolean;
}

const mockData: Collaboration[] = [
  {
    id: '1',
    brand: 'Glossier',
    platform: 'instagram',
    deliverable: 'Reel + Stories',
    recordingDate: '2024-01-18',
    postingDate: '2024-01-20',
    amount: 2500,
    status: 'pending',
    paymentDueDate: '2024-02-01',
    onboardingReceived: true,
  },
  {
    id: '2',
    brand: 'Nike',
    platform: 'youtube',
    deliverable: 'Dedicated Video',
    recordingDate: '2024-01-10',
    postingDate: '2024-01-18',
    amount: 8000,
    status: 'paid',
    paymentDueDate: '2024-01-25',
    onboardingReceived: true,
  },
  {
    id: '3',
    brand: 'Notion',
    platform: 'instagram',
    deliverable: 'Carousel Post',
    recordingDate: '2024-01-08',
    postingDate: '2024-01-15',
    amount: 1800,
    status: 'delayed',
    paymentDueDate: '2024-01-20',
    onboardingReceived: false,
  },
  {
    id: '4',
    brand: 'Skillshare',
    platform: 'youtube',
    deliverable: 'Integration',
    recordingDate: '2024-01-19',
    postingDate: '2024-01-22',
    amount: 3500,
    status: 'pending',
    paymentDueDate: '2024-02-05',
    onboardingReceived: true,
  },
  {
    id: '5',
    brand: 'Figma',
    platform: 'instagram',
    deliverable: 'Post + Story',
    recordingDate: '2024-01-20',
    postingDate: '2024-01-25',
    amount: 2200,
    status: 'pending',
    paymentDueDate: '2024-02-10',
    onboardingReceived: true,
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    default:
      return <Globe className="w-4 h-4" />;
  }
};

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  paid: 'bg-success/10 text-success border-success/20',
  delayed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const CollabTable = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = mockData.filter((collab) =>
    collab.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search collaborations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 soft-input"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Brand</TableHead>
              <TableHead className="font-semibold">Platform</TableHead>
              <TableHead className="font-semibold">Deliverable</TableHead>
              <TableHead className="font-semibold">Posting Date</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment Due</TableHead>
              <TableHead className="font-semibold">Onboarding</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((collab, index) => (
              <TableRow
                key={collab.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-medium">{collab.brand}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <PlatformIcon platform={collab.platform} />
                    </div>
                    <span className="capitalize text-sm">{collab.platform}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{collab.deliverable}</TableCell>
                <TableCell>{collab.postingDate}</TableCell>
                <TableCell className="font-semibold">${collab.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn('capitalize text-xs', statusStyles[collab.status])}
                  >
                    {collab.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{collab.paymentDueDate}</TableCell>
                <TableCell>
                  <Badge variant={collab.onboardingReceived ? 'default' : 'secondary'} className="text-xs">
                    {collab.onboardingReceived ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {mockData.length} collaborations
        </p>
      </div>
    </div>
  );
};

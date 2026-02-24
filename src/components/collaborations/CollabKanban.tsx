import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Instagram, Youtube, Globe, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Collaboration {
  id: string;
  brand_name: string;
  platform: string;
  amount: number;
  payment_status: string;
  payment_due_date: string;
  deliverable: string;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes('instagram')) return <Instagram className="w-3 h-3" />;
  if (p.includes('youtube')) return <Youtube className="w-3 h-3" />;
  return <Globe className="w-3 h-3" />;
};

// --- ADDED onMove TO PROPS ---
export const CollabKanban = ({ data, onMove }: { data: Collaboration[], onMove: (id: string, status: string) => void }) => {
  
  const columns = [
    { id: 'Pending', title: 'Pending Work', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: Clock },
    { id: 'Delayed', title: 'Payment Delayed', color: 'bg-red-500/10 text-red-700 border-red-200', icon: AlertCircle },
    { id: 'Paid', title: 'Completed & Paid', color: 'bg-green-500/10 text-green-700 border-green-200', icon: CheckCircle2 },
  ];

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId;

    // 1. UPDATE VISUALS INSTANTLY
    onMove(draggableId, newStatus);

    // 2. UPDATE DATABASE IN BACKGROUND
    const { error } = await supabase
      .from('collaborations')
      .update({ payment_status: newStatus })
      .eq('id', draggableId);

    if (error) {
      toast.error("Failed to sync move with database");
      console.error(error);
    } else {
      toast.success(`Updated to ${newStatus}`);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row md:gap-6 md:overflow-x-auto pb-6 gap-4">
        {columns.map((col) => (
          <div key={col.id} className="flex-1 md:min-w-[300px]">
            <div className={cn("flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg border", col.color)}>
              <col.icon className="w-4 h-4" />
              <h3 className="font-semibold text-sm uppercase tracking-wide">{col.title}</h3>
              <span className="ml-auto text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {data.filter(c => c.payment_status === col.id).length}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "space-y-3 min-h-[150px] transition-colors rounded-xl p-1",
                    snapshot.isDraggingOver ? "bg-secondary/30" : ""
                  )}
                >
                  {data
                    .filter((c) => c.payment_status === col.id)
                    .map((collab, index) => (
                      <Draggable key={collab.id} draggableId={collab.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                                "transition-transform",
                                snapshot.isDragging ? "rotate-3" : ""
                            )}
                          >
                            <Card className="p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-l-4 border-l-transparent hover:border-l-primary group bg-card">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-foreground text-sm sm:text-base">{collab.brand_name}</h4>
                                <Badge variant="secondary" className="text-[10px] flex gap-1 items-center flex-shrink-0 ml-2">
                                  <PlatformIcon platform={collab.platform} /> 
                                  <span className="hidden sm:inline">{collab.platform}</span>
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{collab.deliverable}</p>
                              
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-dashed gap-2">
                                <span className="font-mono font-bold text-foreground text-sm">₹{collab.amount.toLocaleString()}</span>
                                {collab.payment_due_date && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> 
                                    {new Date(collab.payment_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  
                  {data.filter(c => c.payment_status === col.id).length === 0 && (
                    <div className="h-24 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm opacity-50">
                      Drop here
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
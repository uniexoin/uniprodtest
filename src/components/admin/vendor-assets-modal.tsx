import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Package } from 'lucide-react';
import { useVendorAssets, useDeleteVendorAsset } from '@/hooks/use-admin';
import { toast } from 'sonner';

export function VendorAssetsModal({
    vendor,
    isOpen,
    onClose
}: {
    vendor: any | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { data: assets, isLoading } = useVendorAssets(vendor?._id || null);
    const deleteAsset = useDeleteVendorAsset();

    const [isDeletingAll, setIsDeletingAll] = useState(false);

    if (!vendor) return null;

    const handleDelete = (assetId: string, type: string) => {
        if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
        
        deleteAsset.mutate(
            { vendorId: vendor._id, assetId, type },
            {
                onSuccess: () => toast.success('Listing removed successfully'),
                onError: (err: any) => toast.error(err.message || 'Failed to remove listing')
            }
        );
    };

    const handleDeleteAll = () => {
        if (!confirm(`Are you sure you want to PURGE ALL LISTINGS for ${vendor.businessName}? This cannot be undone.`)) return;
        
        setIsDeletingAll(true);
        deleteAsset.mutate(
            { vendorId: vendor._id, purgeAll: true },
            {
                onSuccess: () => {
                    toast.success('All listings purged successfully');
                    setIsDeletingAll(false);
                    onClose();
                },
                onError: (err: any) => {
                    toast.error(err.message || 'Failed to purge listings');
                    setIsDeletingAll(false);
                }
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                <div className="p-6 pb-4 border-b border-border bg-surface/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Manage Listings: {vendor.businessName}
                        </DialogTitle>
                        <DialogDescription>
                            View and remove listings associated with this vendor.
                        </DialogDescription>
                    </DialogHeader>

                    {assets && assets.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteAll}
                                disabled={isDeletingAll || deleteAsset.isPending}
                                className="font-bold uppercase tracking-wider text-xs gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {isDeletingAll ? 'Purging...' : 'Purge All Listings'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-background/50">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : assets?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No listings found for this vendor.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {assets?.map((asset: any) => (
                                <div key={asset.id} className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl shadow-sm hover:border-primary/20 transition-all group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {asset._assetType}
                                            </span>
                                            <h4 className="font-bold text-foreground">
                                                {asset.title || asset.name || `${asset.make} ${asset.model}`}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[400px]">
                                            {asset.description || 'No description available'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(asset.id, asset._assetType)}
                                        disabled={deleteAsset.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictorField } from "@/lib/xml-utils";
import { Sparkles } from "lucide-react";

interface PredictorFormProps {
    fields: PredictorField[];
}

const PredictorForm = ({ fields }: PredictorFormProps) => {
    if (fields.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                No predictable fields found in this XML.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-1">
            <div className="grid gap-6">
                {fields.map((field, i) => (
                    <div key={`${field.path}-${i}`} className="space-y-2 p-4 rounded-lg bg-card border shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-1">
                            <Label className="text-sm font-bold text-primary flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> {field.name}
                            </Label>
                            <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                                {field.type}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono truncate mb-2">
                            Path: {field.path}
                        </p>
                        <Input
                            placeholder={`Enter value for ${field.name}...`}
                            className="bg-background/50 border-primary/20 focus:border-primary/50"
                        />
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t flex justify-end">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Run Prediction Flow
                </Button>
            </div>
        </div>
    );
};

export default PredictorForm;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowLeftCircleIcon } from "lucide-react";

function Form({
  title,
  subtitle,
  fields,
  onBack,
  buttonLabel,
  onClick,
  footer,
}) {
  return (
    <Card className="z-20 relative">
      <CardHeader className="w-[350px]">
        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>
          <h2>{subtitle}</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            {fields.map((field, i) => {
              return (
                <div key={i} className="grid w-full items-center gap-1">
                  {field}
                </div>
              );
            })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {onBack ? (
            <Button variant="ghost" size="fit" onClick={onBack}>
              <ArrowLeft className="!w-8 !h-8 text-pool-black" />
            </Button>
          ) : (
            <></>
          )}
          <Button onClick={onClick}>{buttonLabel}</Button>
        </div>
        {footer}
      </CardFooter>
    </Card>
  );
}

export default Form;

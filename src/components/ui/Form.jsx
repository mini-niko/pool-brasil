import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

function Form({ steps, onSubmit, error }) {
  const [pageNumber, setPageNumber] = useState(0);

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
      <div className="grid w-full items-center gap-4">
        {steps &&
          steps[pageNumber].map((field, i) => {
            return (
              <div key={i} className="grid w-full items-center gap-1">
                {field}
              </div>
            );
          })}
      </div>
      <div className="flex items-center gap-4">
        {pageNumber > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="fit"
            onClick={() => {
              setPageNumber(pageNumber - 1);
            }}
          >
            <ArrowLeft className="!w-8 !h-8 text-pool-black" />
          </Button>
        )}
        {pageNumber === steps.length - 1 && (
          <Button
            type="submit"
            disabled={Object.keys(error || {}).length !== 0}
          >
            Enviar
          </Button>
        )}

        {pageNumber < steps.length - 1 && (
          <Button
            type="button"
            onClick={() => {
              setPageNumber(pageNumber + 1);
            }}
          >
            Próximo
          </Button>
        )}
      </div>
    </form>
  );
}

export default Form;

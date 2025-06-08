import { cn } from "../../lib/utils";

import * as React from "react";

export function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  );
}

export function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mt-8 mb-4",
        className
      )}
      {...props}
    />
  );
}

export function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3",
        className
      )}
      {...props}
    />
  );
}

export function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function H5({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function H6({ className, ...props }: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
}

export function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn("relative w-full overflow-hidden text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr className={cn("m-0 border-b last:border-b-0", className)} {...props} />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  );
}

export function List({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  );
}

export function OrderedList({
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  );
}

export function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("mt-2", className)} {...props} />;
}

export function InlineCode({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-xl", className)} {...props} />
  );
}

export function Large({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function Small({ className, ...props }: React.ComponentProps<"small">) {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

export function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function A({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "font-medium underline underline-offset-4 text-primary hover:opacity-80",
        className
      )}
      {...props}
    />
  );
}

export function Hr({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("my-6 border-muted", className)} {...props} />;
}

// New components for enhanced MDX experience
export function Step({
  number,
  title,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  number: number;
  title: string;
}) {
  return (
    <div className={cn("my-8 relative pl-12", className)} {...props}>
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-semibold">
        {number}
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Note({
  title = "Note",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
          i
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-blue-900 dark:text-blue-100">
            {title}
          </p>
          <div className="text-blue-800 dark:text-blue-200 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Warning({
  title = "Warning",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-white text-xs font-bold">
          !
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-yellow-900 dark:text-yellow-100">
            {title}
          </p>
          <div className="text-yellow-800 dark:text-yellow-200 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Info({
  title = "Info",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  return (
    <div
      className={cn(
        "my-6 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">
          ✓
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-emerald-900 dark:text-emerald-100">
            {title}
          </p>
          <div className="text-emerald-800 dark:text-emerald-200 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Pre({ className, ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-slate-950 dark:bg-slate-900 p-4 text-sm",
        className
      )}
      {...props}
    />
  );
}

export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
        className
      )}
      {...props}
    />
  );
}

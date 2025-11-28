declare namespace JSX {
    interface IntrinsicElements {
        "eugen-summary": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            "project-id"?: string;
            query?: string;
            demo?: boolean;
        };
    }
}

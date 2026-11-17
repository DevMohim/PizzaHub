import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: React.ReactNode;
}

/**
 * Reusable card wrapper for auth forms.
 * Renders a title, description, the form fields (children)
 * and a link to the opposite auth page.
 */
function AuthCard({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl font-bold">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center border-t !pt-4">
        <p className="text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium text-primary hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default AuthCard;

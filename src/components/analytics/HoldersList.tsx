import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Holder {
  address: string;
  balance: number;
}

interface HoldersListProps {
  holders: Holder[];
}

export const HoldersList = ({ holders }: HoldersListProps) => {
  // Sort holders by balance in descending order
  const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Holders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHolders.map((holder) => (
              <TableRow key={holder.address}>
                <TableCell>{holder.address}</TableCell>
                <TableCell>{holder.balance.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
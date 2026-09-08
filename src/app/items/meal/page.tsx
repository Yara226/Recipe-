
import Cooking from '../../components/Cooking/Cooking'
type SearchParams = Promise<{ mealId?: string }> | { mealId?: string } | undefined;

export default async function page({ searchParams }: { searchParams: SearchParams }) {
      const resolvedParams = await Promise.resolve(searchParams ?? {});
  const mySearch = resolvedParams.mealId ?? '';

  return (
   <>
    <Cooking mealId={mySearch} />
    {console.log("mealId from searchParams:", mySearch)}
   </>
  )
}

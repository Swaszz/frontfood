import MenuCards from "../../components/user/Cards";
import useFetch from "../../hooks/useFetch";
import MenuSkelton from "../../components/shared/Skelton";

function Menuitem() {
  const [MenuitemList, isLoading] = useFetch("/menuitem/getmenu");

  return (
    <div className="container mx-auto px-4 py-10">
      {isLoading ? (
        <MenuSkelton />
      ) : (
        <div className="flex flex-col items-center">
          <section>
            <h1 className="text-3xl font-bold text-center text-primary mb-8">
              Menu Items
            </h1>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 w-full">
            {MenuitemList?.map((menuItem) => (
              <MenuCards key={menuItem?._id} menuItem={menuItem} />
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

export default Menuitem;

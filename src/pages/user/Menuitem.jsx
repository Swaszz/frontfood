import MenuCards from "../../components/user/Cards";
import useFetch from "../../hooks/useFetch";
import MenuSkelton from "../../components/shared/Skelton";

function Menuitem() {
  const [MenuitemList, isLoading] = useFetch("/menuitem/getmenu");
  return (
    <div>
      {isLoading ? (
        <MenuSkelton />
      ) : (
        <div className="flex flex-col items-center justify-start px-20 py-16 ">
          <section>
            <h1 className="text-3xl font-bold text-center text-primary mb-6">
              MenuItems
            </h1>
          </section>
          <section className="grid grid-rows-3 grid-cols-3  gap-y-10 w-full">
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

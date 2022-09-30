import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import AdminView from "../../components/admin/AdminView";
import { trpc } from "../../utils/trpc";

const AddUser = dynamic(() => import("../../components/admin/AddUser"), {
  ssr: false,
});

const UsersPage: NextPage = () => {
  const { data, error, isFetching } = trpc.useQuery(["users.all-users"]);

  const TableStyle = (x: number) => {
    if (x % 2) {
      return "bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700";
    }
    return "bg-white border-b dark:bg-gray-900 dark:border-gray-700`";
  };
  return (
    <>
      <Head>
        <title>Management - Users</title>
      </Head>
      <AdminView>
        {data && (
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    User Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Number
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Role
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, i) => {
                  return (
                    <tr key={i} className={`${TableStyle(i)}`}>
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.name}
                      </th>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.mobile}</td>
                      <td className="py-4 px-6">${user.role}</td>
                      <td className="py-4 px-6">
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {/* <AddUser /> */}
      </AdminView>
    </>
  );
};

export default UsersPage;

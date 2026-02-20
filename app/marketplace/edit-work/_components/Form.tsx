import { categories } from "../(data)/data";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import Image from "next/image";

interface Work {
  category: string;
  photos: Array<string | File>;
  title: string;
  description: string;
  price: number; // Ensure this is a number
}

interface FormProps {
  type: string;
  work: Work;
  setWork: React.Dispatch<React.SetStateAction<Work>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({ type, work, setWork, handleSubmit }) => {
  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhotos = e.target.files ? Array.from(e.target.files) : [];
    setWork((prevWork) => ({
      ...prevWork,
      photos: [...prevWork.photos, ...newPhotos],
    }));
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setWork((prevWork) => ({
      ...prevWork,
      photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle price conversion to number
    const updatedValue = name === "price" ? parseFloat(value) : value;

    setWork((prevWork) => ({
      ...prevWork,
      [name]: updatedValue,
    }));
  };

  return (
    <div className="bg-[#e0f0e0] p-10 sm:p-5">
      <h1 className="text-[#008000] mb-7">{type} Your Work</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[#f0fff0] p-7 rounded-2xl sm:p-5"
      >
        <h3 className="text-[#008000] mb-4">
          Which of these categories best describes your work?
        </h3>
        <div className="flex flex-wrap gap-10 mb-10 px-5 lg:px-5 md:px-0">
          {categories?.map((item, index) => (
            <p
              key={index}
              className={`font-semibold text-lg cursor-pointer ${
                work.category === item ? "text-[#00ff00]" : ""
              } hover:text-[#00ff00]`}
              onClick={() => {
                setWork({ ...work, category: item });
              }}
            >
              {item}
            </p>
          ))}
        </div>

        <h3 className="text-[#50a339] mb-4">Add some photos of your work</h3>
        {work.photos.length < 1 && (
          <div className="flex flex-col justify-center items-center cursor-pointer border-dashed border-2 border-[#c0ffc0] p-10 rounded-lg hover:bg-[#e0ffe0] transition-all sm:p-8">
            <input
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label
              htmlFor="image"
              className="flex flex-col items-center cursor-pointer"
            >
              <IoIosImages className="text-6xl" />
              <p className="font-semibold text-center">
                Upload from your device
              </p>
            </label>
          </div>
        )}

        {work.photos.length > 0 && (
          <div className="flex flex-wrap gap-4 my-8">
            {work.photos.map((photo, index) => (
              <div key={index} className="relative w-60 h-36 cursor-move">
                {photo instanceof File ? (
                  <Image src={URL.createObjectURL(photo)} alt="work" fill />
                ) : (
                  <Image src={photo} alt="work" fill />
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-0 right-0 p-1 bg-[#f0fff0] text-2xl hover:text-[#00ff00]"
                >
                  <BiTrash />
                </button>
              </div>
            ))}
            <input
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUploadPhotos}
              multiple
            />
            <label
              htmlFor="image"
              className="flex flex-col justify-center items-center cursor-pointer border-dashed border-2 border-[#c0ffc0] w-60 h-36 hover:bg-[#e0ffe0] transition-all"
            >
              <IoIosImages className="text-6xl" />
              <p className="font-semibold text-center">
                Upload from your device
              </p>
            </label>
          </div>
        )}

        <h3 className="text-[#008000] mb-4">
          What makes your Work attractive?
        </h3>
        <div className="space-y-4">
          <p className="font-semibold">Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={work.title}
            required
            className="border border-[#c0ffc0] p-4 rounded-md w-full focus:outline-none"
          />
          <p className="font-semibold mt-5">Description</p>
          <textarea
            placeholder="Description"
            onChange={handleChange}
            name="description"
            value={work.description}
            required
            className="border border-[#c0ffc0] p-4 rounded-md w-full h-40 resize-none focus:outline-none"
          />
          <p className="font-semibold mt-5">Now, set your PRICE</p>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-semibold">$</span>
            <input
              type="number"
              placeholder="Price"
              onChange={handleChange}
              name="price"
              value={work.price}
              required
              className="border border-[#c0ffc0] p-4 rounded-md w-32 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-10 w-full bg-[#008000] text-[#f0fff0] py-4 rounded-md font-semibold hover:shadow-lg transition-all"
        >
          PUBLISH YOUR WORK
        </button>
      </form>
    </div>
  );
};

export default Form;

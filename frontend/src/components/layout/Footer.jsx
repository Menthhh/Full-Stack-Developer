const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} User Management System. All rights reserved.
            </div>
  
            <div className="flex space-x-6">
              <a
                href="https://github.com/Menthhh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                Visit my GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
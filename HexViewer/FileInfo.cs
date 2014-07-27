using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace HexViewer
{
    public enum FileType : ushort
    {
        Unknown = 0x0000,
        File = 0x8180,
        Directory = 0x41ed
    }

    /*
     * ==========================================
     * 4 bytes - String Length
     * Domain
     * 4 bytes - String Length
     * Path or Directory
     * 4 bytes - Separator (ffff)
     * 4 bytes - String Length or (ffff)
     * File Hash
     * 4 bytes - Separator (ffff)
     * 4 bytes - Directory (41ed) or File (8180)
     * 8 bytes - (0000 0000)
     * 4 bytes - ?????
     * 4 bytes - Size?
     * 4 bytes - ?????
     * 12 bytes - (0019 0000 0019)
     * 24 bytes - Date Time Possibly?
     * 12 bytes - (0000 0000 0000)
     * 4 bytes - ?????
     * 4 bytes - (0400 or 0000)
     */
    public class FileInfo
    {
        private static readonly SHA1 Sha1Generator = SHA1.Create();

        public string Domain { get; private set; }
        public string Path { get; private set; }
        public string FileContentHash { get; private set; }
        public FileType Type { get; private set; }
        
        // 12 bytes Unknown
        public byte[] Unknown { get; private set; }

        // 4 bytes (Size?)
        public int Size { get; private set; }

        // 16 bytes Unknown
        public byte[] Unknown2 { get; private set; }

        // 24 bytes (Date Time?)
        public byte[] DateTime { get; private set; }

        // 16 bytes Unknown
        public byte[] Unknown3 { get; private set; }

        // 4 bytes Unknown
        public byte[] Unknown4 { get; private set; }

        // Domain-Path
        public string FileNameHash
        {
            get { return CreateSha1Hash(Domain + "-" + Path); }
        }

        private static string CreateSha1Hash(string valueToHash)
        {
            var hashBytes = Sha1Generator.ComputeHash(Encoding.ASCII.GetBytes(valueToHash));
            return Encoding.ASCII.GetString(hashBytes);
        }

        public FileInfo()
    }
}

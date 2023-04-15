package com.example.ethglobal

import android.os.Bundle
import android.os.Handler
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.ethglobal.databinding.FragmentFirstBinding

/**
 * A simple [Fragment] subclass as the default destination in the navigation.
 */
class FirstFragment : Fragment() {

    private var _binding: FragmentFirstBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFirstBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.editText.requestFocus()
        val network = listOf("Celo Testnet", "Goerli Linea", "Binance Testnet", "Ethereum", "Binance", "Polygon", "Celo")
        binding.buttonFirst.setOnClickListener {
            binding.loading.visibility = View.VISIBLE
            binding.containerLogin.visibility = View.GONE
            binding.containerList.visibility = View.GONE
            Handler().postDelayed({
                val editTextContent = binding.inputEditText.text.toString()
                if (editTextContent.isEmpty()) return@postDelayed
                val activities = (activity as MainActivity).getActivities(binding.spinner.selectedItemPosition, editTextContent)
                displayActivities(activities)
            }, 500)
        }
        binding.spinner.setSelection(0)
        binding.spinner.adapter = ArrayAdapter(requireContext(), R.layout.row, network)
    }

    private fun displayActivities(activities: List<String>) {
        binding.loading.visibility = View.GONE
        binding.containerList.visibility = View.VISIBLE
        val adapter = ActivitiesListAdapter {
            Handler().postDelayed({
                val action = FirstFragmentDirections.actionFirstFragmentToSecondFragment(it)
                findNavController().navigate(action)
            }, 200)
        }
        binding.containerList.layoutManager = LinearLayoutManager(context)
        binding.containerList.adapter = adapter
        adapter.submitList(activities)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}